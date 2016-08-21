'use strict';

/**
 * 全局设置
 */
global.rootPath = __dirname;
global.Promise = require("bluebird");
global.fs = Promise.promisifyAll(require("fs"));
global.util = require("./util.js");
global.config = util.loadConfig();
global.pool = util.connectDB();
global.redisClient = util.redisClient();

global.express = require("express");
var bodyparser = require("body-parser");
var ejs = require("ejs");
var app = express();

//静态文件中间件
app.use(express.static('public'));

//配置post body解析中间件
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//session配置
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
app.use(session({
  secret: '!@#$%',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true,maxAge: 1000 * 60 * 12 },
  store: new RedisStore({
      client : redisClient
  })
}));

//设置ejs模板
app.set("views","./views");
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

//挂载自定义路由表
app.use("/login",require(rootPath.concat("/router/loginRouter.js")));

//404错误中间件
app.use((req, res, next) => {
    console.error(req.url.concat("not found"));
    res.status(404).send(config.message.notfound);
});

//服务器内中错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(config.message.servererr);
});

//当发生了未捕获的异常 守护中间件
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});

app.listen(80,() => console.log("服务器启动成功!"));