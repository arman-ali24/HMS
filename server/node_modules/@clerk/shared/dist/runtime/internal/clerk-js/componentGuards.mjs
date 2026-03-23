//#region src/internal/clerk-js/componentGuards.ts
const isSignedInAndSingleSessionModeEnabled = (clerk, environment) => {
	return !!(clerk.isSignedIn && environment?.authConfig.singleSessionMode);
};
const noUserExists = (clerk) => {
	return !clerk.user;
};
const noOrganizationExists = (clerk) => {
	return !clerk.organization;
};
const disabledOrganizationsFeature = (_, environment) => {
	return !environment?.organizationSettings.enabled;
};
const disabledUserBillingFeature = (_, environment) => {
	return !environment?.commerceSettings.billing.user.enabled;
};
const disabledOrganizationBillingFeature = (_, environment) => {
	return !environment?.commerceSettings.billing.organization.enabled;
};
const disabledAllBillingFeatures = (_, environment) => {
	return disabledUserBillingFeature(_, environment) && disabledOrganizationBillingFeature(_, environment);
};
const disabledUserAPIKeysFeature = (_, environment) => {
	return !environment?.apiKeysSettings?.user_api_keys_enabled;
};
const disabledOrganizationAPIKeysFeature = (_, environment) => {
	return !environment?.apiKeysSettings?.orgs_api_keys_enabled;
};
const disabledAllAPIKeysFeatures = (_, environment) => {
	return disabledUserAPIKeysFeature(_, environment) && disabledOrganizationAPIKeysFeature(_, environment);
};

//#endregion
export { disabledAllAPIKeysFeatures, disabledAllBillingFeatures, disabledOrganizationAPIKeysFeature, disabledOrganizationBillingFeature, disabledOrganizationsFeature, disabledUserAPIKeysFeature, disabledUserBillingFeature, isSignedInAndSingleSessionModeEnabled, noOrganizationExists, noUserExists };
//# sourceMappingURL=componentGuards.mjs.map