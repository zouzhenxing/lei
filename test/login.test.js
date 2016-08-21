'use strict';

var expect = require('chai').expect;
var fetch = require("node-fetch");

var rooturl = "http://localhost";
var header = {"Content-type":"application/x-www-form-urlencoded"};

describe('登录模块测试',() => {
    it("登录请求成功测试",() => {
        let body = "name=admin@yuanku.org&pwd=admin";        
        return fetch(rooturl.concat('/login/login'),{method:'post',headers:header,body:body}).then(( res )=> {
            return res.json();
        }).then((json)=> {
            console.log(json);
            expect(json).to.be.deep.equal({"code":1,"msg":"登录成功!"});
        });
    });

    it("登录请求失败测试",()=> {
        let body = "name=admin@yuanku.org&pwd=test";        
        return fetch(rooturl.concat('/login/login'),{method:'post',headers:header,body:body}).then(( res )=> {
            return res.json();
        }).then((json)=> {
            console.log(json);
            expect(json).to.be.deep.equal({"code":0,"msg":"登录失败!"});
        });
    });
});