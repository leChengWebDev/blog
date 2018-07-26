const http = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

function startServer(route, handle) {
  const onRequest = function(req, res) {
    let pathnameUrl = url.parse(req.url).pathname;
    let query = url.parse(req.url).query;
    let str = "";
    req.on("data", data => {
      str += data;
    });
    let POSTDATA = {};
    let is_json;
   
    req.on("end", function() {
      // POST方法
      try{
         if(JSON.parse(str) instanceof Object){
           is_json = true;
         }
      }catch(err){
        is_json = false;
      }
      if (req.method === "POST") {
        if (str.length > 1e6) {
          req.connection.destroy();
        }
        if(!is_json){
          queryData = str;
        }
        else{
          queryData = JSON.parse(str);
        }
        route(handle, pathnameUrl, res, queryData,req);
      } else {
        route(handle, pathnameUrl, res, query);
      }
    });
  };
  var server = http.createServer(onRequest);
  server.listen(3000);
  console.log("Server started on localhost port 3000");
}
module.exports.startServer = startServer;
