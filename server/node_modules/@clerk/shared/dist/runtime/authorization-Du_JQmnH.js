
//#region src/authorization.ts
const TYPES_TO_OBJECTS = {
	strict_mfa: {
		afterMinutes: 10,
		level: "multi_factor"
	},
	strict: {
		afterMinutes: 10,
		level: "second_factor"
	},
	moderate: {
		afterMinutes: 60,
		level: "second_factor"
	},
	lax: {
		afterMinutes: 1440,
		level: "second_factor"
	}
};
const ALLOWED_LEVELS = new Set([
	"first_factor",
	"second_factor",
	"multi_factor"
]);
const ALLOWED_TYPES = new Set([
	"strict_mfa",
	"strict",
	"moderate",
	"lax"
]);
const ORG_SCOPES = new Set([
	"o",
	"org",
	"organization"
]);
const USER_SCOPES = new Set(["u", "user"]);
const isValidMaxAge = (maxAge) => typeof maxAge === "number" && maxAge > 0;
const isValidLevel = (level) => ALLOWED_LEVELS.has(level);
const isValidVerificationType = (type) => ALLOWED_TYPES.has(type);
const prefixWithOrg = (value) => value.replace(/^(org:)*/, "org:");
/**
* Checks if a user has the required organization-level authorization.
* Verifies if the user has the specified role or permission within their organization.
*
* @returns null, if unable to determine due to missing data or unspecified role/permission.
*/
const checkOrgAuthorization = (params, options) => {
	const { orgId, orgRole, orgPermissions } = options;
	if (!params.role && !params.permission) return null;
	if (!orgId || !orgRole || !orgPermissions) return null;
	if (params.permission) return orgPermissions.includes(prefixWithOrg(params.permission));
	if (params.role) return prefixWithOrg(orgRole) === prefixWithOrg(params.role);
	return null;
};
const checkForFeatureOrPlan = (claim, featureOrPlan) => {
	const { org: orgFeatures, user: userFeatures } = splitByScope(claim);
	const [rawScope, rawId] = featureOrPlan.split(":");
	const hasExplicitScope = rawId !== void 0;
	const scope = rawScope;
	const id = rawId || rawScope;
	if (hasExplicitScope && !ORG_SCOPES.has(scope) && !USER_SCOPES.has(scope)) throw new Error(`Invalid scope: ${scope}`);
	if (hasExplicitScope) {
		if (ORG_SCOPES.has(scope)) return orgFeatures.includes(id);
		if (USER_SCOPES.has(scope)) return userFeatures.includes(id);
	}
	return [...orgFeatures, ...userFeatures].includes(id);
};
const checkBillingAuthorization = (params, options) => {
	const { features, plans } = options;
	if (params.feature && features) return checkForFeatureOrPlan(features, params.feature);
	if (params.plan && plans) return checkForFeatureOrPlan(plans, params.plan);
	return null;
};
const splitByScope = (fea) => {
	const org = [];
	const user = [];
	if (!fea) return {
		org,
		user
	};
	const parts = fea.split(",");
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i].trim();
		const colonIndex = part.indexOf(":");
		if (colonIndex === -1) throw new Error(`Invalid claim element (missing colon): ${part}`);
		const scope = part.slice(0, colonIndex);
		const value = part.slice(colonIndex + 1);
		if (scope === "o") org.push(value);
		else if (scope === "u") user.push(value);
		else if (scope === "ou" || scope === "uo") {
			org.push(value);
			user.push(value);
		}
	}
	return {
		org,
		user
	};
};
const validateReverificationConfig = (config) => {
	if (!config) return false;
	const convertConfigToObject = (config$1) => {
		if (typeof config$1 === "string") return TYPES_TO_OBJECTS[config$1];
		return config$1;
	};
	const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
	const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
	if (isValidStringValue || isValidObjectValue) return convertConfigToObject.bind(null, config);
	return false;
};
/**
* Evaluates if the user meets re-verification authentication requirements.
* Compares the user's factor verification ages against the specified maxAge.
* Handles different verification levels (first factor, second factor, multi-factor).
*
* @returns null, if requirements or verification data are missing.
*/
const checkReverificationAuthorization = (params, { factorVerificationAge }) => {
	if (!params.reverification || !factorVerificationAge) return null;
	const isValidReverification = validateReverificationConfig(params.reverification);
	if (!isValidReverification) return null;
	const { level, afterMinutes } = isValidReverification();
	const [factor1Age, factor2Age] = factorVerificationAge;
	const isValidFactor1 = factor1Age !== -1 ? afterMinutes > factor1Age : null;
	const isValidFactor2 = factor2Age !== -1 ? afterMinutes > factor2Age : null;
	switch (level) {
		case "first_factor": return isValidFactor1;
		case "second_factor": return factor2Age !== -1 ? isValidFactor2 : isValidFactor1;
		case "multi_factor": return factor2Age === -1 ? isValidFactor1 : isValidFactor1 && isValidFactor2;
	}
};
/**
* Creates a function for comprehensive user authorization checks.
* Combines organization-level and reverification authentication checks.
* The returned function authorizes if both checks pass, or if at least one passes
* when the other is indeterminate. Fails if userId is missing.
*/
const createCheckAuthorization = (options) => {
	return (params) => {
		if (!options.userId) return false;
		const billingAuthorization = checkBillingAuthorization(params, options);
		const orgAuthorization = checkOrgAuthorization(params, options);
		const reverificationAuthorization = checkReverificationAuthorization(params, options);
		if ([billingAuthorization || orgAuthorization, reverificationAuthorization].some((a) => a === null)) return [billingAuthorization || orgAuthorization, reverificationAuthorization].some((a) => a === true);
		return [billingAuthorization || orgAuthorization, reverificationAuthorization].every((a) => a === true);
	};
};
/**
* Shared utility function that centralizes auth state resolution logic,
* preventing duplication across different packages.
*
* @internal
*/
const resolveAuthState = ({ authObject: { sessionId, sessionStatus, userId, actor, orgId, orgRole, orgSlug, signOut, getToken, has, sessionClaims }, options: { treatPendingAsSignedOut = true } }) => {
	if (sessionId === void 0 && userId === void 0) return {
		actor: void 0,
		getToken,
		has: () => false,
		isLoaded: false,
		isSignedIn: void 0,
		orgId: void 0,
		orgRole: void 0,
		orgSlug: void 0,
		sessionClaims: void 0,
		sessionId,
		signOut,
		userId
	};
	if (sessionId === null && userId === null) return {
		actor: null,
		getToken,
		has: () => false,
		isLoaded: true,
		isSignedIn: false,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		sessionClaims: null,
		sessionId,
		signOut,
		userId
	};
	if (treatPendingAsSignedOut && sessionStatus === "pending") return {
		actor: null,
		getToken,
		has: () => false,
		isLoaded: true,
		isSignedIn: false,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		sessionClaims: null,
		sessionId: null,
		signOut,
		userId: null
	};
	if (!!sessionId && !!sessionClaims && !!userId && !!orgId && !!orgRole) return {
		actor: actor || null,
		getToken,
		has,
		isLoaded: true,
		isSignedIn: true,
		orgId,
		orgRole,
		orgSlug: orgSlug || null,
		sessionClaims,
		sessionId,
		signOut,
		userId
	};
	if (!!sessionId && !!sessionClaims && !!userId && !orgId) return {
		actor: actor || null,
		getToken,
		has,
		isLoaded: true,
		isSignedIn: true,
		orgId: null,
		orgRole: null,
		orgSlug: null,
		sessionClaims,
		sessionId,
		signOut,
		userId
	};
};

//#endregion
Object.defineProperty(exports, 'createCheckAuthorization', {
  enumerable: true,
  get: function () {
    return createCheckAuthorization;
  }
});
Object.defineProperty(exports, 'resolveAuthState', {
  enumerable: true,
  get: function () {
    return resolveAuthState;
  }
});
Object.defineProperty(exports, 'splitByScope', {
  enumerable: true,
  get: function () {
    return splitByScope;
  }
});
Object.defineProperty(exports, 'validateReverificationConfig', {
  enumerable: true,
  get: function () {
    return validateReverificationConfig;
  }
});
//# sourceMappingURL=authorization-Du_JQmnH.js.map