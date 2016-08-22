/**
 * 全局设置
 */
global.rootPath = __dirname;
global.Promise = require("bluebird");
global.fs = Promise.promisifyAll(require("fs"));

/**
 * 加载配置文件
 */
var loadConfig = () => {
    var data = fs.readFileSync(rootPath + "/config.json");
    return JSON.parse(data.toString());
}
global.config = loadConfig();

/**
 * 连接redis数据库
 */
var ioRedis = require('ioredis');
var redisClient = () => {
    return ioRedis.createClient(6379, '127.0.0.1');
}
// global.redisClient = redisClient();

/**
 * 加载配置文件
 */
var mysql = require("mysql");
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
exports.pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'epay',
    dateStrings : 'DATETIME'
});
/**
 * 获取数据库连接
 */
exports.getConnect = () => {
    return this.pool.getConnectionAsync().then((conn) => {
        conn.config.queryFormat = sqlFormat;
        return conn;
    });
}
/**
 * 自定义sql语句转议
 */
var sqlFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
        return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};

/**
 * 合成对象
 */
exports.copyObject = ( source,target ) => {
    for(var key in source) {
        target[key] = source[key];
    }
    return target;
}

/**
 * 成功返回
 */
exports.success = ( obj ) => {
    return this.copyObject(config.message.success,obj);
}

/**
 * 返回失败
 */
exports.fail = ( obj ) => {
    return this.copyObject(config.message.error,obj);
}
