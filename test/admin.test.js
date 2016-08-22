'use strict';

var expect = require('chai').expect;
var fetch = require("node-fetch");

var rooturl = "http://localhost";
var header = {"Content-type":"application/x-www-form-urlencoded"};

describe('admin表测试',() => {
    it("增加会员测试",() => {
        let body = "name=admin@yuanku.org&pwd=admin";
        return fetch(rooturl.concat('/admin'),{method:'post',headers:header,body:body}).then(( res )=> {
            return res.json();
        }).then((json)=> {
            console.log(json);
            expect(json).to.be.deep.equal({"code":1,"msg":"操作成功!"});
        });
    });

    it("根据ID获取会员",()=> {      
        return fetch(rooturl.concat('/admin/1')).then(( res )=> {
            return res.json();
        }).then((json)=> {
            console.log(json);
            expect(json.data).to.not.be.empty;
        });
    });

    it("根据ID修改会员",()=> {
        let body = "name=update@yuanku.org&pwd=update";     
        return fetch(rooturl.concat('/admin/1'),{method:'put',headers:header,body:body}).then(( res )=> {
            return res.json();
        }).then((json)=> {
            console.log(json);
            expect(json).to.be.deep.equal({"code":1,"msg":"操作成功!"});
        });
    });

    it("根据ID删除会员",()=> {   
        return fetch(rooturl.concat('/admin/0'),{method:'delete'}).then(( res )=> {
            return res.json();
        }).then((json)=> {
            console.log(json);
            expect(json).to.be.deep.equal({"code":1,"msg":"操作成功!"});
        });
    });
});