const http = require("http");
const fs = require("fs");
const urlLib = require("url");
const querystring = require("querystring");

const MongoClient = require("mongodb").MongoClient;
let mongoUrl = "mongodb://localhost:27017/originBlog";
const server = http.createServer((req, res) => {
  let str = "";
  req.on("data", data => {
    str += data;
  });
  req.on("end", () => {
    const holeUrl = urlLib.parse(req.url, true);
    const url = holeUrl.pathname;
    if (url == "/favicon.ico") {
      return;
    }
    if (url == "/register") {
      let outFile = fs.createWriteStream("./another.png");
      outFile.write(str ,()=> {
        console.log("文件已开始写入");
      });
      outFile.end();
      outFile.on("finish",()=>{
        console.log("already finish");
        res.end();
      })
    } else {
      let filepath = "./" + url;
      fs.readFile(filepath, (err, data) => {
        if (err) {
          throw Error(err);
        } else {
          res.write(data, "utf-8");
        }
        if (str) {
          return;
        } else {
          res.end();
        }
      });
    }
  });

  // req.on("end", () => {
  //   const obj = urlLib.parse(req.url, true);
  //   // 获取接口地址
  //   const url = obj.pathname;
  //   //   获得GET数据
  //   const GET = obj.query;
  //   var POST = {};
  //   // 解析POST数据
  //   if (str) {
  //     try {
  //       POST = JSON.parse(str);
  //     } catch (err) {
  //       POST = {};
  //     }
  //   }
  //   if (url == "/favicon.ico") {
  //     console.log(url);
  //     return;
  //   }
  //   if (url == "/register") {
  //     MongoClient.connect(
  //       mongoUrl,
  //       (err, db) => {
  //         if (err) throw err;
  //         let dbase = db.db("originBlog");
  //         dbase.createCollection("userInfo", (err, res) => {
  //           if (err) throw err;
  //           console.log("userInfo集合创建成功");
  //         });
  //         let myobj = {
  //           name: POST.name,
  //           password: POST.password,
  //           conirmPassword: POST.confirmPassword,
  //           sex: POST.sex,
  //           avatar: POST.avatar,
  //           areaText: POST.areaText
  //         };
  //         dbase.collection("userInfo").insertOne(myobj, (err, res) => {
  //           if (err) throw err;
  //           console.log("集合文档更新成功");
  //           db.close();
  //         });
  //       }
  //     );
  //     res.end();
  //   } else {
  //     let filename = "./" + url;
  //     fs.readFile(filename, (err, data) => {
  //       if (err) {
  //         res.write("错误");
  //       } else {
  //         res.write(data, "utf-8");
  //       }
  //       res.end();
  //     });
  //   }
  // });
});
server.listen(3000);
