//#region src/internal/clerk-js/warnings.d.ts
declare const warnings: {
  proxyUrlAsFunctionNotSupported: string;
  domainAsFunctionNotSupported: string;
  cannotRenderComponentWhenSessionExists: string;
  cannotRenderSignUpComponentWhenSessionExists: string;
  cannotRenderSignUpComponentWhenTaskExists: string;
  cannotRenderComponentWhenTaskDoesNotExist: string;
  cannotRenderSignInComponentWhenSessionExists: string;
  cannotRenderSignInComponentWhenTaskExists: string;
  cannotRenderComponentWhenUserDoesNotExist: string;
  cannotRenderComponentWhenOrgDoesNotExist: string;
  cannotRenderAnyOrganizationComponent: (componentName: "OrganizationProfile" | "OrganizationSwitcher" | "OrganizationList" | "CreateOrganization" | "TaskChooseOrganization") => string;
  cannotRenderAnyBillingComponent: (componentName: "PricingTable" | "Checkout" | "PlanDetails") => string;
  cannotOpenUserProfile: string;
  cannotOpenCheckout: string;
  cannotOpenSignInOrSignUp: string;
  cannotRenderAPIKeysComponent: string;
  cannotRenderAPIKeysComponentForOrgWhenUnauthorized: string;
  cannotRenderAPIKeysComponentForUserWhenDisabled: string;
  cannotRenderAPIKeysComponentForOrgWhenDisabled: string;
};
//#endregion
export { warnings };
//# sourceMappingURL=warnings.d.ts.map