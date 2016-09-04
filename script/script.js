'use strict';

global.Promise = require("bluebird");
var util = require("../util.js");
var ejs = require("ejs");
var fs = Promise.promisifyAll(require("fs"));

/**
 * 获取指定的所有字段
 */
var getTableFaild = ( conn,tabname ) => {
    let sql = "desc ".concat(tabname);
    return conn.queryAsync(sql);
}

var getTableObject = ( fields ) => {
    let pk = 0,inserstr = [],updatestr = [];
    fields.map((field) => {
        if( field.Key === 'PRI' ) {
            pk = field.Field;
        } else if( field.Type === "datetime" ) {
            updatestr.push(field.Field.concat(" = now()"));
        } else {
            updatestr.push(field.Field.concat(" = :",field.Field));
        }

        if( field.Extra === "auto_increment" ) {
            inserstr.push("default");
        } else if( field.Type === "datetime" ) {
            inserstr.push("now()");
        } else {
            inserstr.push(":".concat(field.Field));
        }
    });
    
    return {
        PK : pk,
        inserstr : inserstr.join(","),
        updatestr : updatestr.join(",")
    }
}

let conn;
//开始函数
Promise.coroutine(function* () {
    //获取命令行
    let table = process.argv[2];
    conn = yield util.getConnect();
    //获取表的字段
    let fields = yield getTableFaild(conn,table);
    let tableobj = getTableObject(fields);

    //读取路由模板
    let tmprouter = yield fs.readFileAsync("./script/tempRouter.ejs");
    //编译模板
    tmprouter = ejs.render(tmprouter.toString(),{table:table});
    //写入模板
    yield fs.writeFileAsync("./router/".concat(table,"Router.js"),tmprouter);
    //增加路由至index.js
    let index = yield fs.readFileAsync("./index.js");
    let routerstr = 'app.use("/'.concat(table,'",require(rootPath.concat("/router/',table,'Router.js")));');
    yield fs.writeFileAsync("./index.js",index.toString().replace("//挂载自定义路由表(勿删)","//挂载自定义路由表(勿删)".concat("\n",routerstr)));
    console.log("路由文件创建成功!");
    
    //读取服务模板
    let tmpservice = yield fs.readFileAsync("./script/tempService.ejs");
    //编译模板
    tmpservice = ejs.render(tmpservice.toString(),{table:table});
    //写入模板
    yield fs.writeFileAsync("./service/".concat(table,"Service.js"),tmpservice);
    console.log("服务文件创建成功!");

    // 读取模型模板
    let tmpmodule = yield fs.readFileAsync("./script/tempModule.ejs");
    //编译模板
    tmpmodule = ejs.render(tmpmodule.toString(),{table:table,tableobj:tableobj});
    //写入模板
    yield fs.writeFileAsync("./module/".concat(table,"Module.js"),tmpmodule);
    console.log("模型文件创建成功!");

    // 读取测试模板
    let tmptest = yield fs.readFileAsync("./script/temp.test.ejs");
    //编译模板
    tmptest = ejs.render(tmptest.toString(),{table:table,fields:fields,tableobj:tableobj});
    //写入模板
    yield fs.writeFileAsync("./test/".concat(table,".test.js"),tmptest);
    console.log("创建测试文件成功!");

    process.exit(0);
})().catch((err) => {
    console.log(err.stack);
}).finally(()=> {
    conn.release();
});



/**
 * 获取数据库中所有表名
 */
// var getAllTables = ( conn ) => {
//     let sql = "show tables";
//     return conn.queryAsync(sql).then((result) => {
//         if( result.length == 0 ) {
//             return console.log("没有在数据库中找到表!");
//         }

//         let key = Object.keys(result[0])[0];
//         let tables = [];
//         result.map((item)=> {
//             tables.push(item[key]);
//         });
//         return tables;
//     });
// }