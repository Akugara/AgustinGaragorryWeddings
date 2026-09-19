/* Site behaviour: header, hero slideshow, reveal, photo strips, gallery, consent-gated analytics.
   Plain JS, no dependencies (Fancybox is used only on gallery pages if present). */
(function () {
    'use strict';

    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Analytics (Google Analytics, only after consent) ---------- */
    var GA_ID = 'G-ZQFTGYDECC';
    var CONSENT_KEY = 'ag-consent';

    function readConsent() {
        try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
    }
    function writeConsent(v) {
        try { localStorage.setItem(CONSENT_KEY, v); } catch (e) { /* private mode: just don't persist */ }
    }
    function loadAnalytics() {
        if (window.__gaLoaded) return;
        window.__gaLoaded = true;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { anonymize_ip: true });
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    }

    var banner = $('#consent');
    function showBanner() { if (banner) { banner.hidden = false; } }
    function hideBanner() { if (banner) { banner.hidden = true; } }

    if (readConsent() === 'granted') { loadAnalytics(); }
    else if (readConsent() === null) { showBanner(); }

    if (banner) {
        $('[data-consent="accept"]', banner).addEventListener('click', function () {
            writeConsent('granted'); loadAnalytics(); hideBanner();
        });
        $('[data-consent="decline"]', banner).addEventListener('click', function () {
            writeConsent('denied'); hideBanner();
        });
    }
    $$('[data-consent-open]').forEach(function (b) { b.addEventListener('click', showBanner); });

    /* ---------- Header ---------- */
    var header = $('#site-header');
    var toggle = $('.nav-toggle');
    var ctaBar = $('.cta-bar');

    // Highlight the current section in the nav
    var section = document.body.getAttribute('data-section');
    if (section) {
        $$('.site-nav a[data-nav]').forEach(function (a) {
            if (a.getAttribute('data-nav') === section) a.setAttribute('aria-current', 'page');
        });
    }

    function setMenu(open) {
        header.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) header.classList.remove('is-hidden');
    }
    if (toggle) {
        toggle.addEventListener('click', function () { setMenu(!header.classList.contains('is-open')); });
        $$('.site-nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    }

    var lastY = window.pageYOffset, ticking = false;
    function onScroll() {
        var y = window.pageYOffset;
        header.classList.toggle('is-scrolled', y > 40);
        if (!header.classList.contains('is-open')) {
            // hide on scroll down, reveal on scroll up
            header.classList.toggle('is-hidden', y > lastY && y > 240);
        }
        if (ctaBar) ctaBar.classList.toggle('is-visible', y > window.innerHeight * 0.6);
        lastY = y;
    }
    window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { onScroll(); ticking = false; });
    }, { passive: true });
    onScroll();

    /* ---------- Hero slideshow ---------- */
    var slides = $$('.hero__slide');
    if (slides.length > 1 && !reduceMotion) {
        var current = 0, timer = null;
        var next = function () {
            slides[current].classList.remove('is-active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('is-active');
        };
        var start = function () { if (!timer) timer = setInterval(next, 6500); };
        var stop = function () { clearInterval(timer); timer = null; };
        document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
        start();
    }

    /* ---------- Scroll reveal ---------- */
    var reveals = $$('.reveal');
    if (reveals.length && 'IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('is-in'); });
    }

    /* ---------- Horizontal photo strips ---------- */
    $$('[data-strip]').forEach(function (wrap) {
        var strip = $('.strip', wrap);
        var step = function (dir) {
            strip.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
        };
        var prev = $('[data-strip-prev]', wrap), nxt = $('[data-strip-next]', wrap);
        if (prev) prev.addEventListener('click', function () { step(-1); });
        if (nxt) nxt.addEventListener('click', function () { step(1); });
    });

    /* ---------- Wedding gallery lightbox (Fancybox, loaded on gallery pages only) ---------- */
    if ($('.gallery') && window.Fancybox) {
        window.Fancybox.bind('[data-fancybox="gallery"]', {});
    }

    /* ---------- Footer year ---------- */
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
