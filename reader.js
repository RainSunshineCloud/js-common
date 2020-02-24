function Reader (func,get_by_line) {
    var obj = {};
    obj.dealFunc = func || null;
    obj.get_by_line = get_by_line || false;
    //使用FileReader上传
    obj.readFileByReader = function  ()  {
        var dlg = document.createElement("input");
        dlg.setAttribute("type","file");
        dlg.setAttribute("style","display:none");
        
        dlg.onchange = function(e){
            var file = e.target.files[0]
            var reader = new FileReader();
            reader.onload = function () {
                if (obj.get_by_line) {
                    var lines = this.result.split("\r\n")
                    for (var i = 0; i < lines.length;i ++) {
                        obj.dealFunc(lines[i]); 
                    }
                } else {
                    obj.dealFunc(this.result); 
                }
            }
            reader.readAsText(file);
        }

        document.body.appendChild(dlg);
        dlg.click();
        document.body.removeChild(dlg);
        return true;
    }

    obj.readFile2ByActiveXObject = function  () {
        var dlg = document.createElement("input");
        dlg.setAttribute("type","file");
        document.body.appendChild(dlg);
        dlg.click();
        var path = dlg.value;
        document.body.removeChild(dlg);

        if (path != "") {
            obj.error = "文件不存在";
            obj.code = 100;
            return;
        }

        var fso = new ActiveXObject("Scripting.FileSystemObject");
        var result = "";
        if (fso.FileExists(path)) {
            var file = fso.OpenTextFile(path, 1,false);
            if (obj.get_by_line) {//按行读取
                while (!file.atendofstream) {
                    obj.dealFunc(file.readLine());
                }
            } else { //读取所有
                if (!file.atendofstream) {
                    obj.dealFunc(file.readAll());
                }
            }
           
            file.Close();
        }
        
    }

    obj.read = function () {
        if (!obj.dealFunc) {
            obj.error = "未有处理函数";
            obj.code = 101;
            return false;
        }

        if (window.FileReader) {
            obj.readFileByReader()
        } else if (window.ActiveXObject) {
            obj.readFile2ByActiveXObject()
        } else {
            obj.error = "file_reader 和 ActiveXObject 都不支持，无法读取";
            obj.code = 102;
            return false;
        }

        return true;
    }

    return obj;
}