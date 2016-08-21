'use strict';

exports.login = ( conn,param ) => {
    let sql = "select * from admin where name = ? and pwd = ?";
    return conn.queryAsync(sql,param);
}