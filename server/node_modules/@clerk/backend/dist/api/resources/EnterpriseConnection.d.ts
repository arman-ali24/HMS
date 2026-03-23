import type { EnterpriseConnectionJSON } from './JSON';
/**
 * The Backend `EnterpriseConnection` object holds information about an enterprise connection (SAML or OAuth) for an instance or organization.
 */
export declare class EnterpriseConnection {
    /**
     * The unique identifier for the connection.
     */
    readonly id: string;
    /**
     * The name to use as a label for the connection.
     */
    readonly name: string;
    /**
     * The domain of the enterprise. Sign-in flows using an email with this domain may use the connection.
     */
    readonly domains: Array<string>;
    /**
     * The Organization ID if the connection is scoped to an organization.
     */
    readonly organizationId: string | null;
    /**
     * Indicates whether the connection is active or not.
     */
    readonly active: boolean;
    /**
     * Indicates whether the connection syncs user attributes between the IdP and Clerk or not.
     */
    readonly syncUserAttributes: boolean;
    /**
     * Indicates whether users with an email address subdomain are allowed to use this connection or not.
     */
    readonly allowSubdomains: boolean;
    /**
     * Indicates whether additional identifications are disabled for this connection.
     */
    readonly disableAdditionalIdentifications: boolean;
    /**
     * The date when the connection was first created.
     */
    readonly createdAt: number;
    /**
     * The date when the connection was last updated.
     */
    readonly updatedAt: number;
    constructor(
    /**
     * The unique identifier for the connection.
     */
    id: string, 
    /**
     * The name to use as a label for the connection.
     */
    name: string, 
    /**
     * The domain of the enterprise. Sign-in flows using an email with this domain may use the connection.
     */
    domains: Array<string>, 
    /**
     * The Organization ID if the connection is scoped to an organization.
     */
    organizationId: string | null, 
    /**
     * Indicates whether the connection is active or not.
     */
    active: boolean, 
    /**
     * Indicates whether the connection syncs user attributes between the IdP and Clerk or not.
     */
    syncUserAttributes: boolean, 
    /**
     * Indicates whether users with an email address subdomain are allowed to use this connection or not.
     */
    allowSubdomains: boolean, 
    /**
     * Indicates whether additional identifications are disabled for this connection.
     */
    disableAdditionalIdentifications: boolean, 
    /**
     * The date when the connection was first created.
     */
    createdAt: number, 
    /**
     * The date when the connection was last updated.
     */
    updatedAt: number);
    static fromJSON(data: EnterpriseConnectionJSON): EnterpriseConnection;
}
//# sourceMappingURL=EnterpriseConnection.d.ts.map