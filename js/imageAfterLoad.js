//cambiar imagenes low por hd luego de que esten cargadas
function changeImageAfterLoad(img) {
    var imgLow = img + 'Low';
    document.getElementById(img).style.visibility = "visible";
    document.getElementById(imgLow).remove();
}