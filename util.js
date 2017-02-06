/**
 * 全局设置
 */
global.rootPath = __dirname;
global.Promise = require('bluebird');
global.fs = Promise.promisifyAll(require('fs'));

/**
 * 加载配置文件
 */
global.config = require('./config.json');


/**
 * 配置日志
 */
global.log4js = require('log4js');
log4js.configure({
  appenders: [
    {
      type: 'dateFile',
      filename: 'logs/system.log',
      pattern: '-yyyy-MM-dd',
      category: 'system',
    },
    {
      type: 'console',
      category: 'system',
    },
    {
      type: 'dateFile',
      filename: 'logs/wechat.log',
      pattern: '-yyyy-MM-dd',
      category: 'wechat',
    },
    {
      type: 'console',
      category: 'wechat',
    },
  ],
});

/**
 * 连接redis数据库
 */
const ioRedis = require('ioredis');
const redisClient = () => {
  return new ioRedis(config.redis);
};
// global.redisClient = redisClient();

/**
 * 加载数据库配置文件
 */
const mysql = require('mysql');
Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);
exports.pool = mysql.createPool(config.mysql);

/**
 * 获取数据库连接
 */
exports.getConnect = () => {
  return this.pool.getConnectionAsync().then((conn) => {
    return conn;
  });
};

// 配置文件上传
const multer = require('multer');
exports.upfile = () => {
  const storage = multer.diskStorage({
        // 设置上传后文件路径，uploads文件夹会自动创建。
    destination(req, file, cb) {
      cb(null, './public/uploads');
    },
        // 给上传文件重命名，获取添加后缀名
    filename(req, file, cb) {
      const fileFormat = (file.originalname).split('.');
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    },
  });

  return multer({
    storage,
    limits: {},
  });
};

const multiparty = require('multiparty');
 /*
  * 提取form提交的文件
  * */
exports.parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form({
      maxFieldsSize: 10,
      maxFilesSize: 1024 * 1024 * 3, // 限制上传3m
    });
    form.parse(req, function (err, fields, files) {
      if (err) {
        if (err.code === 'ETOOBIG') {
          return reject(new Error('ETOOBIG')); // 上传文件过大
        }
        return reject(err);
      }
      const _files = [];
      for (const key in files) {
        _files.push(files[key][0]);
      }
      resolve({ fields, files: _files });
    });
  });
};

/**
 * 成功返回
 */
exports.success = (obj) => {
  return Object.assign(obj, config.message.success);
};

/**
 * 返回失败
 */
exports.fail = (obj) => {
  return Object.assign(obj, config.message.error);
};
