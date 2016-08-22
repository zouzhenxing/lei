'use strict';

exports.get = ( conn,param ) => {
    let sql = "select * from admin where id = :id";
    return conn.queryAsync(sql,param);
}

exports.add = ( conn,param ) => {
    let sql = "insert into admin values(default,:name,:pwd)";
    return conn.queryAsync(sql,param).then((result)=> {
        return result.insertId;
    });
}

exports.update = ( conn,param ) => {
    let sql = "update admin set name = :name,pwd = :pwd where id = :id";
    return conn.queryAsync(sql,param);
}

exports.delete = ( conn,param ) => {
    let sql = "delete from admin where id = :id";
    return conn.queryAsync(sql,param).then((result) => {
        return result.affectedRows;
    });
}