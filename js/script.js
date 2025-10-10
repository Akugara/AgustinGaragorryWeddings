let prevScrollpos = window.pageYOffset;
window.onscroll = () => {
    let currentScrollpos = window.pageYOffset;
    let currentMenuHeight = window.getComputedStyle(document.querySelector('#menu')).height;

    // Always show menu if at the top
    if (currentScrollpos < 100) {
        document.getElementById('menu').style.top = "0";
        document.getElementById('menu').style.background = "transparent";
    }
    // Scrolling up
    else if (prevScrollpos > currentScrollpos) {
        document.getElementById('menu').style.top = "0";
        //window.scrollY retorna la posicion actual y
        if (window.scrollY < window.innerHeight * 0.923 && !document.getElementById("toggleMobileMenu").classList.contains('show')) {
            document.getElementById('menu').style.background = "transparent";
        } else {
            document.getElementById('menu').style.background = "var(--ballena-negro)"
        }
    }
    // Scrolling down (only hide if past threshold)
    else {
        document.getElementById('menu').style.top = "-" + currentMenuHeight;
    }
    prevScrollpos = currentScrollpos;
}
function hideMenu() {
    document.getElementById("toggleMobileMenu").classList.remove('show');
    document.getElementById("toggleMobileMenu").classList.add('collapse');
    document.getElementById("myNavBartoggler").classList.add('collapsed');
}
function darkMenuMobile() {
    document.getElementById("menu").style.background = "var(--ballena-negro)";
}

document.addEventListener("DOMContentLoaded", function (e) {
    detectBrowser();
});