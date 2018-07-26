const initDB = require("../initdb");
const fs = require("fs");
// 登陆
function login(response, pathname, POST) {
  function asyncCheckLogin(dbase, pathname, POST) {
    return new Promise((resolve, reject) => {
      dbase
        .collection("userInfo")
        .find({}, { name: 1 })
        .toArray((err, item) => {
          let sMsg;
          let user_id;
          let some = item.some(detailItem => {
            if (
              detailItem.name == POST.name &&
              detailItem.password == POST.password
            ) {
              user_id = detailItem._id;
            }
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
          let nowTime = new Date();
          console.log(nowTime.toUTCString());
          let fetureDay = nowTime.getDate() + 1;
          let timeStamp = nowTime.setDate(fetureDay);
          let expires = nowTime.toUTCString();
          // writeHead和setHeader之间的区别是writeHead可以一次写多个，setHeader只可进行单个设置
          response.writeHead(200, {
            "Content-Type": "text/plain;charset-utf-8",
            "set-cookie": "user_id=" + user_id + ";expires=" + expires
          });

          response.write(
            JSON.stringify({
              code: 0,
              info: sMsg,
              user_id: user_id
            }),
            "utf8"
          );
          response.end();
        });
    });
  }
  initDB
    .initDB()
    .then(res => {
      return asyncCheckLogin(res, pathname, POST);
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
}
// 注册
function register(response, pathname, POST) {
  function asyncCheckInfo(dbase, pathname, POST) {
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
            response.writeHead(200, {
              "Content-Type": "text/plain,charset=utf-8"
            });
            response.write(
              JSON.stringify({
                code: 0,
                info: "该用户已注册，请前往登录"
              }),
              "utf8"
            );
            response.end();
          }
        });
    });
  }
  initDB
    .initDB()
    .then(res => {
      return asyncCheckInfo(res, pathname, POST);
    })
    .then(res => {
      if (res[1] == "faith") {
        let obj = {
          name: POST.name,
          password: POST.pathname,
          sex: POST.sex,
          areaText: POST.areaText
        };
        res[0].collection("userInfo").insertOne(obj, (err, res) => {
          if (err) throw err;
          response.writeHead(200, {
            "Content-Type": "text/plain;charet='utf8'"
          });
          response.write(
            JSON.stringify({
              code: 0,
              info: "注册成功，请前往登陆"
            })
          );
          response.end();
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
}
// 上传图片
function upLoadImg(response, pathname, POST) {
  var POST = Buffer.from(POST);
  var rems = [];
  //根据\r\n分离数据和报头
  for (var i = 0; i < POST.length; i++) {
    var v = POST[i];
    var v2 = POST[i + 1];
    if (v == 13 && v2 == 10) {
      // 拿到的是每个/r的下表值
      rems.push(i);
    }
  }
  //图片信息
  var picmsg_1 = POST.slice(rems[0] + 2, rems[3]).toString();
  var filename = picmsg_1.match(/filename=".*"/g)[0].split('"')[1];
  //图片数据
  var nbuf = POST.slice(rems[3] + 2, rems[rems.length - 2]);
  var path = "./views/" + filename;
  fs.writeFileSync(path, nbuf);
  response.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
  response.end('<div id="path">' + path + "</div>");
}
// 修改名字
function editName(response, pathname, POST, request) {
  let user_id = "";
  let cookieList = request.headers.cookie.split(";");
  for (let i = 0; i < cookieList.length; i++) {
    if (cookieList[i].split("=")[0].trim() === "user_id") {
      user_id = cookieList[i].split("=")[1];
    }
  }
  function edit(dbase, POST) {
    return new Promise((resolve, reject) => {
      dbase
        .collection("userInfo")
        .find({}, { name: 1 })
        .toArray((err, item) => {
          let bool = false;
          for (var i = 0; i < item.length; i++) {
            if (item[i]._id == user_id) {
              resolve([item[i]._id, dbase, POST]);
            }
          }
          if (!bool) {
            reject("faith");
          }
        });
    });
  }
  initDB
    .initDB()
    .then(res => {
      return edit(res, POST);
    })
    .then(res => {
      if (res.length == 3) {
        res[1].collection("userInfo").updateOne(
          {
            _id: res[0]
          },
          { $set: { name: res[2].name } }
        );
      }
      response.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
      response.write(
        JSON.stringify({
          code: 0,
          msg: "修改成功",
          name: res[2].name
        }),
        "utf8"
      );
      response.end();
    })
    .catch(err => {
      console.log(err);
    });
}
// 浏览器icon
function favicon(response) {
  console.log("此请求为收藏图标请求");
}
// 首页
function home(response) {
  response.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
  response.end("您现在正处于根目录", "utf-8");
}
// 其他路径
function otherPath(response, pathname) {
  console.log(pathname);
  // res.write(200,{"content-type":"text/html;charset=utf-8"});
  res.end();
  // response.writeHead(200, { "content-type": "text/html" });
}
// 书写博文，发表博文
function recordBlog(response, pathname, POST, request) {
  let user_id = "";
  let cookieList = request.headers.cookie.split(";");
  for (let i = 0; i < cookieList.length; i++) {
    if (cookieList[i].split("=")[0].trim() === "user_id") {
      user_id = cookieList[i].split("=")[1];
    }
  }
  function releaseBlog(dbase, POST) {
    return new Promise((resolve, reject) => {
      // dbase.collection("userInfo").find({ "_id":"ObjectId("+user_id+")"}).toArray((err,item)=>{
      dbase
        .collection("userInfo")
        .find({ name: "闫杰" })
        .toArray((err, item) => {
          bool = false;
          console.log(item);
          for (let i = 0; i < item.length; i++) {
            if (item[i]._id == user_id) {
              resolve([item[i]._id, item[i].name, dbase]);
              bool = true;
            }
          }
          if (!bool) {
            reject("faith");
          }
        });
    });
  }
  initDB
    .initDB()
    .then(res => {
      return releaseBlog(res, POST);
    })
    .then(res => {
      // const ip =
      //   request.headers["x-forwarded-for"] ||
      //   request.connection.remoteAddress ||
      //   request.socket.remoteAddress ||
      //   (request.connection.socket ? request.connection.socket.remoteAddress : null);
      //   console.log(ip)
      let nowTime = (function() {
        let nowTime = new Date(),
          year = nowTime.getFullYear(),
          month = nowTime.getMonth() + 1<10?"0"+(nowTime.getMonth() + 1):nowTime.getMonth()+1,
          day = nowTime.getDate(),
          hour = nowTime.getHours() < 10
              ? "0" + nowTime.getHours()
              : nowTime.getHours(),
          minute = nowTime.getMinutes() < 10
              ? "0" + nowTime.getMinutes()
              : nowTime.getMinutes(),
          second =nowTime.getSeconds() < 10
              ? "0" + nowTime.getSeconds()
              : nowTime.getSeconds();
              console.log(month);
        return (
          year + "-" +  month +"-" +day +" " +hour +":" + minute +":" +second
        );
      })();
      res[2].collection("userInfo").update(
        { _id: res[0] },
        {
          $push: {
            comments: {
              name: res[1],
              time: nowTime,
              content: POST.writeContent,
              _id:new Date().getTime(),
            }
          }
        }
      );
      response.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
      response.write(
        JSON.stringify({
          code: 0,
          msg: "增加成功"
        })
      );
      response.end();
    })
    .catch(err => {
      console.log(err);
    });
}
function initPage(response,pathname,POST,request){
  console.log(2222);
  let user_id = "";
  let cookieList = request.headers.cookie.split(";");
  for (let i = 0; i < cookieList.length; i++) {
    if (cookieList[i].split("=")[0].trim() === "user_id") {
      user_id = cookieList[i].split("=")[1];
    }
  }
  function personData(dbase,POST){
    return new Promise((resolve,reject)=>{
      console.log(dbase.collection("userInfo").findOne({"_id" :"ObjectId('5b5954137a100133300b267e')"}));
      dbase.collection("userInfo").find({"_id" :"ObjectId('5b5954137a100133300b267e')"}).toArray((err,item)=>{
        console.log(item.length);
        console.log(user_id);
      })
    })
  }
  initDB.initDB().then(res=>{
    return personData(res,POST)
  }).catch(err=>{
    console.log(err);
  })
}
module.exports = {
  login: login,
  register: register,
  home: home,
  otherPath: otherPath,
  upLoadImg: upLoadImg,
  editName: editName,
  recordBlog: recordBlog,
  initPage:initPage
};
