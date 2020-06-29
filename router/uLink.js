const uLink = require("../model/uLink");
const Router = require("koa-router");
var router = new Router({
  prefix: "/uLink"
});

router.post('/addUlinkInfo', async (ctx,next) => {
  let b = ctx.request.body;
  let res = await uLink.addULinkList(b) 
  ctx.data = res
  return next();
})

router.get('/getUlinkList', async (ctx,next) =>{
  let res = await uLink.getAllUlinkInfo()
  ctx.data = res;
  return next();
})

router.post('/delUlinkById', async (ctx,next) => {
  let b = ctx.request.body;
  let res = await uLink.delUlink(b.id);
  ctx.data = '删除成功';
  return next();
})

module.exports = router;