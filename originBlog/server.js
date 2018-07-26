const http = require("http");
const fs = require("fs");
const urlLib = require("url");
const querystring = require("querystring");

const MongoClient = require("mongodb").MongoClient;
let mongoUrl = "mongodb://localhost:27017/originBlog";
// function queryAccount(db, name) {
//   return db.collection(name).find({}, { name: 1 });
// }
const server = http.createServer((req, res) => {
  let str = "";
  req.on("data", data => {
    str += data;
  });
  let serverRes = res;
  req.on("end", () => {
    const obj = urlLib.parse(req.url, true);
    // 获取接口地址
    const url = obj.pathname;
    //   获得GET数据
    const GET = obj.query;
    // 设置post变量
    let POST = {};
    // 解析POST数据
    function init() {
      return new Promise((resolve, reject) => {
        MongoClient.connect(
          mongoUrl,
          (err, db) => {
            if (err) {
              reject(err);
            }
            var collection = db.db("originBlog");
            resolve(collection);
          }
        );
      });
    }
    if (str) {
      try {
        POST = JSON.parse(str);
      } catch (err) {
        POST = {};
      }
    }
    if (url == "/favicon.ico") {
      return;
    }
    if (url == "/login") {
      // 异步验证用户的昵称和密码是否正确
      function asyncCheckLogin(dbase, POST) {
        return new Promise((resolve, reject) => {
          dbase
            .collection("userInfo")
            .find({}, { name: 1 })
            .toArray((err, item) => {
              let sMsg;
              var some = item.some(detailItem => {
                return (
                  detailItem.name == POST.name &&
                  detailItem.password == POST.password
                );
              });
              if (some) {
                sMsg = "登陆成功";
                resolve(sMsg);
              } else {
                sMsg = "用户密码或者昵称错误";
                resolve(sMsg);
              }
              res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8"
              });
              res.write(
                JSON.stringify({
                  code: 0,
                  info: sMsg
                }),
                "utf8"
              );
              res.end();
            });
        });
      }
      init()
        .then(res => {
          return asyncCheckLogin(res, POST);
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    } else if (url == "/register") {
      // 对初始化连接数据库中的异步函数进行promise处理
      // 异步检查是否注册
      function asyncCheckInfo(dbase, POST) {
        return new Promise((resolve, reject) => {
          dbase
            .collection("userInfo")
            .find({}, { name: 1 })
            .toArray((err, item) => {
              if (!item.length) {
                resolve([dbase, "faith"]);
              }
              var some = item.some(detailItem => {
                return detailItem.name == POST.name;
              });
              if (!some) {
                resolve([dbase, "faith"]);
              } else {
                res.writeHead(200, { "Content-Type": "text/xml","Expires": "Fri, 30 Oct 2018 14:19:41"});
                res.write(
                  JSON.stringify({
                    code: 0,
                    info: "该用户已注册，请前往登录"
                  }),
                  "utf8"
                );
                res.end();
              }
            });
        });
      }
      // promise 解决node.js回调地狱
      // to do 使用await aysnc会更好
      init()
        .then(res => {
          return asyncCheckInfo(res, POST);
        })
        .then(res => {
          if (res[1] == "faith") {
            let obj = {
              name: POST.name,
              password: POST.password,
              conirmPassword: POST.confirmPassword,
              sex: POST.sex,
              areaText: POST.areaText
            };
            res[0].collection("userInfo").insertOne(obj, (err, res) => {
              if (err) throw err;
              serverRes.writeHead(200, {
                "Content-Type": "text/plain;charet='utf8'"
             
              });
              serverRes.write(JSON.stringify({
                  code:0,
                  info:"注册成功，请前往登陆"
              }))
              serverRes.end();
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      let filename = "./" + url;
      fs.readFile(filename, (err, data) => {
        if (err) {
          res.write("错误");
        } else {
          // res.writeHead(200, {
          //   "Cache-Control":"max-age=10000"
          //   // 'Access-Control-Allow-Origin': '*',
          //   // 'ETag': "666666s",
          //   // 'Cache-Control': 'max-age=31536000, public',
          //   // 'Expires': 'Mon, 07 Sep 2026 09:32:27 GMT'
          // })
          res.write(data, "utf-8");
        }
        res.end();
      });
    }
  });
});

server.listen(3000);
