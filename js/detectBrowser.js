// Previously redirected non-Safari browsers to a non-existent index-fallback.html,
// which broke the site for Firefox and others. Kept as a no-op so existing calls
// (e.g. in script.js) don't error.
function detectBrowser() {}
