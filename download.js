function download (content,file_name)  {
    var blob = new Blob([content], {type: 'text/plain'});
    if (navigator.msSaveBlob) {
        return navigator.msSaveBlob(blob, file_name);
    } else {
        var dlg = document.createElement("a");
        dlg.setAttribute("download",file_name);
        dlg.setAttribute("display",{"display:none"});
        var src = URL.createObjectURL(blob);
        dlg.setAttribute("href",src)
        document.body.appendChild(dlg);
        dlg.click();
        document.body.removeChild(dlg);
    }
}