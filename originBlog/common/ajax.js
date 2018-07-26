function Ajax(method, reqURL, data, callBack) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, reqURL, true);
    xhr.setRequestHeader("Content-type","text/html,charset=utf-8");
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200 || xhr.status == 304) {
         
                callBack(xhr.responseText);
            }
        }
    }
};