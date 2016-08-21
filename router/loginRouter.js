'use strict';

var loginService = require(rootPath.concat("/service/loginService.js"));

/**
 * 登录路由器
 */
let loginRouter = express.Router();

loginRouter.post("/login",loginService.login);
loginRouter.get("/logout",loginService.logout);

module.exports = loginRouter;