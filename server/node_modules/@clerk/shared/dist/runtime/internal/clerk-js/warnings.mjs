//#region src/internal/clerk-js/warnings.ts
const formatWarning = (msg) => {
	return `🔒 Clerk:\n${msg.trim()}\n(This notice only appears in development)`;
};
const createMessageForDisabledOrganizations = (componentName) => {
	return formatWarning(`The <${componentName}/> cannot be rendered when the feature is turned off. Visit 'dashboard.clerk.com' to enable the feature. Since the feature is turned off, this is no-op.`);
};
const createMessageForDisabledBilling = (componentName) => {
	return formatWarning(`The <${componentName}/> component cannot be rendered when billing is disabled. Visit 'https://dashboard.clerk.com/last-active?path=billing/settings' to follow the necessary steps to enable billing. Since billing is disabled, this is no-op.`);
};
const propertyAsFunctionNotSupported = (property) => {
	return formatWarning(`${property} as a function is not supported in this environment. The value will be ignored. Provide an absolute URL instead.`);
};
const warnings = {
	proxyUrlAsFunctionNotSupported: propertyAsFunctionNotSupported("proxyUrl"),
	domainAsFunctionNotSupported: propertyAsFunctionNotSupported("domain"),
	cannotRenderComponentWhenSessionExists: "The <SignUp/> and <SignIn/> components cannot render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the Home URL instead.",
	cannotRenderSignUpComponentWhenSessionExists: "The <SignUp/> component cannot render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the value set in `afterSignUp` URL instead.",
	cannotRenderSignUpComponentWhenTaskExists: "The <SignUp/> component cannot render when a user has a pending task, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the task instead.",
	cannotRenderComponentWhenTaskDoesNotExist: "<TaskChooseOrganization/> cannot render unless a session task is pending. Clerk is redirecting to the value set in `redirectUrlComplete` instead.",
	cannotRenderSignInComponentWhenSessionExists: "The <SignIn/> component cannot render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the `afterSignIn` URL instead.",
	cannotRenderSignInComponentWhenTaskExists: "The <SignIn/> component cannot render when a user has a pending task, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, Clerk is redirecting to the task instead.",
	cannotRenderComponentWhenUserDoesNotExist: "<UserProfile/> cannot render unless a user is signed in. Since no user is signed in, this is no-op.",
	cannotRenderComponentWhenOrgDoesNotExist: `<OrganizationProfile/> cannot render unless an organization is active. Since no organization is currently active, this is no-op.`,
	cannotRenderAnyOrganizationComponent: createMessageForDisabledOrganizations,
	cannotRenderAnyBillingComponent: createMessageForDisabledBilling,
	cannotOpenUserProfile: "The UserProfile modal cannot render unless a user is signed in. Since no user is signed in, this is no-op.",
	cannotOpenCheckout: "The Checkout drawer cannot render unless a user is signed in. Since no user is signed in, this is no-op.",
	cannotOpenSignInOrSignUp: "The SignIn or SignUp modals do not render when a user is already signed in, unless the application allows multiple sessions. Since a user is signed in and this application only allows a single session, this is no-op.",
	cannotRenderAPIKeysComponent: "The <APIKeys/> component cannot be rendered when API keys is disabled. Since API keys is disabled, this is no-op.",
	cannotRenderAPIKeysComponentForOrgWhenUnauthorized: "The <APIKeys/> component cannot be rendered for an organization unless a user has the required permissions. Since the user does not have the necessary permissions, this is no-op.",
	cannotRenderAPIKeysComponentForUserWhenDisabled: "The <APIKeys/> component cannot be rendered when user API keys are disabled. Since user API keys are disabled, this is no-op.",
	cannotRenderAPIKeysComponentForOrgWhenDisabled: "The <APIKeys/> component cannot be rendered when organization API keys are disabled. Since organization API keys are disabled, this is no-op."
};
for (const key of Object.keys(warnings)) {
	const item = warnings[key];
	if (typeof item !== "function") warnings[key] = formatWarning(item);
}

//#endregion
export { warnings };
//# sourceMappingURL=warnings.mjs.map