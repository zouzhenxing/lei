#说明
我整合这个框架是为解决三个问题：
第一、不想每一次都要重新整合
第二、不想写重复格式化的代码
第三、想让代码的风格基本统一
所以我实现了根据表自动生成代码的功能。
主要整合了Express redis mysql bluebird mocha等模块

#如何使用
##第一步：先clone文件到本地
git clone https://github.com/zouzhenxing/lei.git
npm install 下载依赖

##第二步：进入本地文件夹，修改util.js中的数据库配置，保证能连接到指定数据库
```
exports.pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'epay',
    dateStrings : 'DATETIME'
});
```
##第三步：进入script文件夹，运行
node script\script 表名  生成对应表的CURD代码 

##第四步：查看代码，进行相应的数据库字段整理，开启服务器
node index

##第五步：测试代码
npm test

#自定义生成模板
我非常讨厌封装过深的东西，所以在写这个框架的时候，尽量做到不封装。你可以按自己的想法来定义代码生成模板.
script/temp.test.ejs 测试代码模板
script/tempModule.ejs 模型代码模板
script/tempRouter.ejs 路由代码模板
script/tempService.ejs 服务代码模板
所有模板都使用ejs进行渲染

你也近自己的想法可以修改script.js中的生成逻辑
