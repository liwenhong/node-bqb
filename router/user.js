const sequelize = require("../db/dbInstance");
const user = require("../model/user");
const Router = require("koa-router");
var router = new Router({
  prefix: "/user"
});

router.get("/hello", async ctx => {
  ctx.data = "hello welcome koa2";
});

router.post("/hello", async ctx => {
  ctx.data = +new Date();
});

router.post("/error", async (ctx,next) => {
  ctx.data = 'null.aa';
});

router.get("/getUser", async (ctx, next) => {
  let b = ctx.request.query;
  let userinfo = await user.getUserInfo(b.name)
  ctx.data = userinfo;
});

router.get("/addUser", async (ctx, next) => {
  let b = ctx.request.query;
  let a = await user.addUser(b.name,b.mobile);
  console.log('..............'+a);
  ctx.data = a;
});
router.post("/login",async (ctx,next) => {
  let b = ctx.request.body;
  // let temp = JSON.parse(b);
  if(b.username == 'admin'){
    ctx.data =  {
      roles: ['admin'],
      token: 'admin',
      introduction: '我是超级管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }
  }else{
    ctx.data = "用户名不正确";
  }
  return next();

})
router.get("/info",async (ctx,next) => {
    ctx.data =  {
      roles: ['admin'],
      token: 'admin',
      introduction: '我是超级管理员',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }
  return next();
})

module.exports = router;
