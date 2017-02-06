'use strict';

global.Promise = require('bluebird');
const util = require('../util.js');
const ejs = require('ejs');
const fs = Promise.promisifyAll(require('fs'));

/**
 * 获取指定的所有字段
 */
const getTableFaild = (conn, tabname) => {
  const sql = 'desc '.concat(tabname);
  return conn.queryAsync(sql);
};

const getTablePK = (fields) => {
  let pk = 0;
  fields.map((field) => {
    if(field.Key === 'PRI') {
      pk = field.Field;
      return false;
    }
    return true;
  });
    
  return pk;
};

let conn;
// 开始函数
Promise.coroutine(function* () {
    // 获取命令行
  const table = process.argv[2];
  conn = yield util.getConnect();
    // 获取表的字段
  const fields = yield getTableFaild(conn, table);
  const PK = getTablePK(fields);

    // 读取路由模板
  let tmprouter = yield fs.readFileAsync('./script/tempRouter.ejs');
    // 编译模板
  tmprouter = ejs.render(tmprouter.toString(), { table });
    // 写入模板
  yield fs.writeFileAsync('./router/'.concat(table, 'Router.js'), tmprouter);
    // 增加路由至index.js
  const index = yield fs.readFileAsync('./index.js');
  const routerstr = 'app.use("/'.concat(table, '",require(rootPath.concat("/router/', table, 'Router.js")));');
  yield fs.writeFileAsync('./index.js', index.toString().replace('// 挂载自定义路由表(勿删)', '// 挂载自定义路由表(勿删)'.concat('\n', routerstr)));
  console.log('路由文件创建成功!');
    
    // 读取服务模板
  let tmpservice = yield fs.readFileAsync('./script/tempService.ejs');
    // 编译模板
  tmpservice = ejs.render(tmpservice.toString(), { table });
    // 写入模板
  yield fs.writeFileAsync('./service/'.concat(table, 'Service.js'), tmpservice);
  console.log('服务文件创建成功!');

    // 读取模型模板
  let tmpmodule = yield fs.readFileAsync('./script/tempModule.ejs');
    // 编译模板
  tmpmodule = ejs.render(tmpmodule.toString(), { table, PK });
    // 写入模板
  yield fs.writeFileAsync('./module/'.concat(table, 'Module.js'), tmpmodule);
  console.log('模型文件创建成功!');

    // 读取测试模板
  let tmptest = yield fs.readFileAsync('./script/temp.test.ejs');
    // 编译模板
  tmptest = ejs.render(tmptest.toString(), { table, fields, PK });
    // 写入模板
  yield fs.writeFileAsync('./test/'.concat(table, '.test.js'), tmptest);
  console.log('创建测试文件成功!');

  process.exit(0);
})().catch((err) => {
  console.log(err.stack);
}).finally(() => {
  conn.release();
});
