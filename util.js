/**
 * 全局设置
 */
global.rootPath = __dirname;
global.Promise = require("bluebird");
global.fs = Promise.promisifyAll(require("fs"));

/**
 * 加载配置文件
 */
global.config = require("./config.json");

/**
 * 连接redis数据库
 */
var ioRedis = require('ioredis');
var redisClient = () => {
    return new ioRedis(config.redis);
}
// global.redisClient = redisClient();

/**
 * 加载数据库配置文件
 */
var mysql = require("mysql");
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
exports.pool = mysql.createPool(config.mysql);

/**
 * 获取数据库连接
 */
exports.getConnect = () => {
    return this.pool.getConnectionAsync().then((conn) => {
        return conn;
    });
}

//配置文件上传
var multer = require('multer');
exports.upfile = () => {
    var storage = multer.diskStorage({
        //设置上传后文件路径，uploads文件夹会自动创建。
        destination: function (req, file, cb) {
            cb(null, './public/uploads')
        }, 
        //给上传文件重命名，获取添加后缀名
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    });

    return multer({
        storage: storage,
        limits:{}
    });
}

/**
 * 成功返回
 */
exports.success = ( obj ) => {
    return Object.assign(obj,config.message.success);
}

/**
 * 返回失败
 */
exports.fail = ( obj ) => {
    return Object.assign(obj,config.message.error);
}
