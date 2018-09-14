const imgSourceType = require("../model/imgSourceType");
const Router = require("koa-router");
var router = new Router({
  prefix: "/imgsourcetype"
});

router.post("/addImgSourceType", async (ctx, next) => {
  let b = ctx.request.body;
  if (b.typename) {
    let res = await imgSourceType.addImgSourceType(b.typename);
    ctx.data = res;
  } else {
    ctx.data = "输入的参数不正确";
  }
  return next();
});

router.get("/getSourceTypeList", async (ctx, next) => {
  await imgSourceType
    .getSourceTypeList()
    .then(res => {
      ctx.data = res;
    })
    .catch(error => {
      ctx.data = error;
    });
  return next();
});

router.get("/delSourceType", async (ctx, next) => {
  let q = ctx.request.query;
  if (q.id) {
    await imgSourceType.delSourceType(q.id).then(res => {
      ctx.data = "删除成功";
    });
  } else {
    ctx.data = "传入的参数错误";
  }
  return next();
});

router.post("/updateSourceType", async (ctx, next) => {
  let b = ctx.request.body;
  if (b.id && b.newname) {
    await imgSourceType.updateSourceType(b.id, b.newname).then(res => {
      ctx.data = "更新成功";
    });
  } else {
    ctx.data = "传入的参数错误";
  }
  return next();
});
module.exports = router;
