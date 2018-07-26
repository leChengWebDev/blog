* 登录注册
* 上传文件模块
* 发布博文模块
* 查看博文模块
* 博文留言模块
* 首页　个人中心　奇思杂感　文件上传
---
* mongodb中的语法有些并不适用于node.js中，比如db.getCollection("集合");
* mongodb中查询返回指定字段，db.collection.find({},{"id":1,"title":1}) [查询该集合全部文档，第一个参数为查询条件，后面的指示为只查id和title字段]
* db.collection.find({},{"content":0})[查询除content之外的所有字段]

**db.collection("userInfo").find("_id":user_id)无法查询到条件**