const feedBack = require("../model/feedback");
const Router = require("koa-router");
var router = new Router({
  prefix: "/feedback"
});

router.post("/add", async (ctx,next) => {
  let b = ctx.request.body;
  let data = {
    typeName:b.typeName,
    describe:b.describe,
    path:b.path,
    email:b.emial,
    mobile:b.mobile
  }
  await feedBack.add(data).then(res => {
    ctx.data ="反馈成功"
  }).catch(error => {
    ctx.data = "反馈失败"
  })
  return next();
})

module.exports = router;