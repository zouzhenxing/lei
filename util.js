/**
 * 加载配置文件
 */
var mysql = require("mysql");
var ioRedis = require('ioredis');
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

exports.loadConfig = () => {
    var data = fs.readFileSync(rootPath + "/config.json");
    return JSON.parse(data.toString());
}

exports.connectDB = () => {
    return mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'epay',
        dateStrings : 'DATETIME'
    });
}

exports.redisClient = () => {
    return ioRedis.createClient(6379, '127.0.0.1');
}