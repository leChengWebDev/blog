const fs = require("fs");
const path = require("path");

function route(handle, pathname, response, params,req) {
  if (pathname == "/favicon.ico") {
    return;
  }
  if (typeof handle[pathname] == "function") {
    handle[pathname](response, pathname, params,req);
  } else {
    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });

    let realPath = path.join(
      "C:/Users/yanjie/Desktop/blog/originBlog",
      pathname
    );
    var data = fs.readFile(realPath, (err, data) => {
      if (err) {
        response.writeHead(200,{"Content-Type":"text/html,charset=utf-8"});
        var  data_404 = fs.readFile("C:/Users/yanjie/Desktop/blog/originBlog/404.html",(newErr,newData)=>{
          if(newErr){
          }
          else{
            response.write(newData);
            response.end();
          }
        })
      } else {
        response.writeHead(200, { "Content-Type": "text/html,charset=utf-8" });
        response.write(data);
        response.end();
      }
    });
  }
}

module.exports.route = route;
