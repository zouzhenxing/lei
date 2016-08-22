'use strict';

global.Promise = require("bluebird");
var util = require("../util.js");
var ejs = require("ejs");
var fs = Promise.promisifyAll(require("fs"));

/**
 * 获取数据库中所有表名
 */
var getAllTables = ( conn ) => {
    let sql = "show tables";
    return conn.queryAsync(sql).then((result) => {
        if( result.length == 0 ) {
            return console.log("没有在数据库中找到表!");
        }

        let key = Object.keys(result[0])[0];
        let tables = [];
        result.map((item)=> {
            tables.push(item[key]);
        });
        return tables;
    });
}

/**
 * 获取指定的所有字段
 */
var getTableFaild = ( conn,tabname ) => {
    let sql = "desc ".concat(tabname);
    return conn.queryAsync(sql).then((fields) => {
        let pk = 0,inserstr = [],updatestr = [];
        fields.map((field) => {
            if( field.Key === 'PRI' ) {
                pk = field.Field;
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
    });
}

let conn;
//开始函数
Promise.coroutine(function* () {
    //获取命令行
    let table = process.argv[2];
    conn = yield util.getConnect();
    //获取表的字段
    let fields = yield getTableFaild(conn,table);
 
    //读取路由模板
    let tmprouter = yield fs.readFileAsync("./tempRouter.ejs");
    //编译模板
    tmprouter = ejs.render(tmprouter.toString(),{table:table});
    //写入模板
    yield fs.writeFileAsync("../router/".concat(table,"Router.js"),tmprouter);
    console.log("路由文件创建成功!");
    
    //读取服务模板
    let tmpservice = yield fs.readFileAsync("./tempService.ejs");
    //编译模板
    tmpservice = ejs.render(tmpservice.toString(),{table:table});
    //写入模板
    fs.writeFileAsync("../service/".concat(table,"Service.js"),tmpservice);
    console.log("服务文件创建成功!");

    // 读取模型模板
    let tmpmodule = yield fs.readFileAsync("./tempModule.ejs");
    //编译模板
    tmpmodule = ejs.render(tmpmodule.toString(),{table:table,fields:fields});
    //写入模板
    fs.writeFileAsync("../module/".concat(table,"Module.js"),tmpmodule);
    console.log("模型文件创建成功!");

    console.log(fields);
})().catch((err) => {
    console.log(err.stack);
}).finally(()=> {
    conn.release();
});