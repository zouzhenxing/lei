'use strict';

var adminModule = require(rootPath.concat("/module/adminModule.js"));

exports.select = (req,res,next) => {

}

exports.get = (req,res,next) => {
    let conn;
    Promise.coroutine(function* () {
        conn = yield util.getConnect();
        let result = yield adminModule.get(conn,{id:req.params.id});
        return res.json(util.success( {data:result} ));
    })().catch(( err )=> {
        console.log(err);
        return res.json(config.message.error);
    }).finally(()=> {
        conn.release();
    });
}

exports.add = (req,res,next) => {
    let conn;
    Promise.coroutine(function* () {
        conn = yield util.getConnect();
        yield adminModule.add(conn,req.body);
        return res.json(config.message.success);
    })().catch(( err )=> {
        console.log(err);
        return res.json(config.message.error);
    }).finally(()=> {
        conn.release();
    });
}

exports.update = (req,res,next) => {
    let conn;
    Promise.coroutine(function* () {
        conn = yield util.getConnect();
        req.body.id = req.params.id;
        yield adminModule.update(conn,req.body);
        return res.json(config.message.success);
    })().catch(( err )=> {
        console.log(err);
        return res.json(config.message.error);
    }).finally(()=> {
        conn.release();
    });
}

exports.delete = (req,res,next) => {
    let conn;
    Promise.coroutine(function* () {
        conn = yield util.getConnect();
        yield adminModule.delete(conn,req.params);
        return res.json(config.message.success);
    })().catch(( err )=> {
        console.log(err);
        return res.json(config.message.error);
    }).finally(()=> {
        conn.release();
    });
}