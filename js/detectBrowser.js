function detectBrowser() {
    if (navigator.userAgent.indexOf("Safari") == -1)  {
        location.href = 'index-fallback.html';
    }
}