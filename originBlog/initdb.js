const MongoClient = require("mongodb").MongoClient;
let mongoUrl = "mongodb://localhost:27017/originBlog";
function init() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      mongoUrl,
      (err, db) => {
        if (err) {
          reject(err);
        }
        // 数据库对象
        const collection = db.db("originBlog");
        resolve(collection);
      }
    );
  });
}
module.exports.initDB = init;
