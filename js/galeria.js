document.getElementById("menu").style.background = "var(--ballena-negro)";
let prevScrollpos = window.pageYOffset;
window.onscroll = () => {
    let currentScrollpos = window.pageYOffset;
    let currentMenuHeight = window.getComputedStyle(document.querySelector('#menu')).height;
    if (prevScrollpos > currentScrollpos) {
        document.getElementById('menu').style.top = "0";
    }
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

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById("spinner").style.display = "none";
});

function cargaGaleria() {
    sleep();
}

function sleep() {
    setTimeout(function () {
        init();
    }, 100);
}