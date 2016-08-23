#说明
由于每次新项目都要重新整合模块，还有好多代码都是格式化重复，每个同事写代码风格总是不一样。为了这样的问题，要浪费好多时间，于是发杨风格自己整合一些模块，然后规定代码风格。最重要的是，可以生成格式化代码，于是lei（累）就产生了。

#如何使用
1. 先下载代码
git clone https://github.com/zouzhenxing/lei.git

2.进入文件夹，安装依赖
npm i

3.目录结构介绍
![untitled3.png](//dn-cnode.qbox.me/FjgQ7mw_klrnImLxN6EMQL_vfba5)
router/ 路由文件
service/ 服务文件
module/ 数据库交互文件
test/ 测试文件目录

4.连接数据库
假设我现在创建一个数据名为hurun，其中有三张表hrcase,casephoto,casestatus
修改util.js中的连接数据库配置为如下：
```
exports.pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'hurun',
    dateStrings : 'DATETIME'
});
```
5.生成代码
输入命令：node script/script hrcase 结果如下：
![untitled4.png](//dn-cnode.qbox.me/FjTMIRWdtPgJyyf2xu-nKN40XQ-6)
如此再输入：node script/script casephoto node script/script casestatus
生成代码如下：
![untitled5.png](//dn-cnode.qbox.me/FpfnACBQHtdrNNTrd4hmeU6HLdqd)
![untitled6.png](//dn-cnode.qbox.me/FlSXaJHBYLl_IDXrxVsb9yX2r1vE)
![untitled7.png](//dn-cnode.qbox.me/Fh9dWxN0X1O61zwzdK_gXqqTk3Od)
![untitled8.png](//dn-cnode.qbox.me/FvG_CwqrtC_4puKQ055q9MmblYsw)

6.找开测试文件
增加测试和修改测试中的body需要根据表中字段自定义
```
it("增加hrcase测试",() => {
        //请填写增加对象let body = "name=admin@yuanku.org&password=admin";
        let body = "weparty=张三&otherparty=李四&thirdparty=王五&casesubject=1&organizers=华北大区&casestatus=1"; //自已定义
        return fetch(rooturl.concat('/hrcase'),{method:'post',headers:header,body:body}).then(( res )=> {
            return res.json();
        }).then((json)=> {
            console.log(json);
            expect(json).to.be.deep.equal({"code":1,"msg":"操作成功!"});
        });
    });
```

7.挂载路由
打开index.js文件，将生成的路由文件挂载到app中
```
//挂载自定义路由表
app.use("/hrcase",require(rootPath.concat("/router/hrcaseRouter.js")));
app.use("/casephoto",require(rootPath.concat("/router/casephotoRouter.js")));
app.use("/casestatus",require(rootPath.concat("/router/casestatusRouter.js")));
```
开启服务器
node index.js

8.运行测试文件
npm test
![untitled9.png](//dn-cnode.qbox.me/Fq-MyJM4eSQdYZXjr8ZK-jOIj0wh)
查看测试结果
打开 mochawesome-reports/mochawesome.html
![untitled10.png](//dn-cnode.qbox.me/FhvDy20GWwavbZCcO5RjpXsAhSBe)
测试完成

9.自定义生成模板
我非常讨厌封装过深的东西，所以在写这个框架的时候，尽量做到不封装。你可以按自己的想法来定义代码生成模板.
script/temp.test.ejs 测试代码模板
script/tempModule.ejs 模型代码模板
script/tempRouter.ejs 路由代码模板
script/tempService.ejs 服务代码模板
所有模板都使用ejs进行渲染

你也近自己的想法可以修改script.js中的生成逻辑