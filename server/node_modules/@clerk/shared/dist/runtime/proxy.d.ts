//#region src/proxy.d.ts
/**
 *
 */
declare function isValidProxyUrl(key: string | undefined): boolean;
/**
 *
 */
declare function isHttpOrHttps(key: string | undefined): boolean;
/**
 *
 */
declare function isProxyUrlRelative(key: string): boolean;
/**
 *
 */
declare function proxyUrlToAbsoluteURL(url: string | undefined): string;
/**
 * Function that determines whether proxy should be used for a given URL.
 */
type ShouldProxyFn = (url: URL) => boolean;
//#endregion
export { ShouldProxyFn, isHttpOrHttps, isProxyUrlRelative, isValidProxyUrl, proxyUrlToAbsoluteURL };
//# sourceMappingURL=proxy.d.ts.map