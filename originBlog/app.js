const server = require("./server_3000");
const router = require("./routes/router");
const handler = require("./routes/handler");
const handle = {};
//把方法转接到handle对象中 
handle['/'] = handler.home;
handle['/register'] = handler.register;
handle['/login'] = handler.login;
handle['/upLoadImg'] = handler.upLoadImg;
handle['/editName'] = handler.editName;
handle['/recordBlog'] = handler.recordBlog;
handle['/initPage'] = handler.initPage;
server.startServer(router.route,handle)
