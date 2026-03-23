//#region src/proxy.ts
/**
*
*/
function isValidProxyUrl(key) {
	if (!key) return true;
	return isHttpOrHttps(key) || isProxyUrlRelative(key);
}
/**
*
*/
function isHttpOrHttps(key) {
	return /^http(s)?:\/\//.test(key || "");
}
/**
*
*/
function isProxyUrlRelative(key) {
	return key.startsWith("/");
}
/**
*
*/
function proxyUrlToAbsoluteURL(url) {
	if (!url) return "";
	return isProxyUrlRelative(url) ? new URL(url, window.location.origin).toString() : url;
}

//#endregion
export { proxyUrlToAbsoluteURL as i, isProxyUrlRelative as n, isValidProxyUrl as r, isHttpOrHttps as t };
//# sourceMappingURL=proxy-BcfViKjn.mjs.map