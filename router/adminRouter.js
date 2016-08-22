'use strict';

let adminService = require(rootPath.concat("/service/adminService.js"));
let adminRouter = express.Router();

adminRouter.get("/",adminService.select);
adminRouter.get("/:id",adminService.get);
adminRouter.post("/",adminService.add);
adminRouter.put("/:id",adminService.update);
adminRouter.delete("/:id",adminService.delete);

module.exports = adminRouter;