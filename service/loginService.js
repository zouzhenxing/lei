'use strict';

var loginModule = require(rootPath.concat("/module/loginModule.js"));

exports.login = ( req,res,next ) => {
    let conn = null;
    Promise.coroutine(function* () {
        conn = yield pool.getConnectionAsync();
        let result = yield loginModule.login(conn,[req.body.name,req.body.pwd]);
        if( result.length ) {
            res.send(config.message.loginSuccess);
        } else {
            res.send(config.message.loginError);
        }
    })().catch((err)=>{
        next(err);
    }).finally(()=> {
        conn.release();
    });
};


exports.logout = ( req,res,next ) => {
    
}