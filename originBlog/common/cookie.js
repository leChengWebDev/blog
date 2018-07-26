var setCookie = {
    setCookie:function(name,value,time,domain){
        var str = name+"="+value;
        if(time){
            str += " expires="+time;
        }
        if(domain){
            str += " domain="+domain;
        }
        document.cookie = str;
    },
    getCookie:function(name){
        var cookieStr = document.cookie;
        var everyCookie  = cookieStr.split(";");
        for(var i = 0; i < everyCookie.length;i++){
            if(everyCookie[i].split("=")[0].trim() == name){
                return everyCookie[i].split("=")[1].trim();
            }
        }
        return null;
    },
    unsetCookie:function(name){
        this.setCookie(name,"",new Date(0));
    }
}