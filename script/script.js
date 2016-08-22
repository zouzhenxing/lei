'use strict';

global.Promise = require("bluebird");
var util = require("../util.js");
var pool = util.connectDB();

var getAllTables = () => {
    let sql = "show tables";
    return pool.getConnectionAsync().then((conn) => {
        return conn.queryAsync(sql);
    }).then((result) => {
        if( result.length == 0 ) {
            return console.log("没有在数据库中找到表!");
        }

        let key = Object.keys(result[0])[0];
        let tables = [];
        result.map((item)=> {
            tables.push(item[key]);
        });
        return tables;
    })
}

var getTableFaild = ( tabname ) => {
    let sql = "desc ".concat(tabname);
    return pool.getConnectionAsync().then((conn) => {
        return conn.queryAsync(sql);
    });
}