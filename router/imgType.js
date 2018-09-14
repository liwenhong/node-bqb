const sequelize = require("../db/dbInstance");
const imgtype = require("../model/imgType");
const Router = require("koa-router");
var router = new Router({
  prefix: "/imgtype"
});

router.get("/hello", async ctx => {
  ctx.data = "hello welcome koa2";
});

router.post("/addImgType", async (ctx,next) => {
  let b = ctx.request.body;
  let result = await imgtype.addImgType(b.name,b.ishot,b.istop);
  ctx.data = result;
  return next();
});

/**
 * 查询首页数据
 */
router.get("/getIndexData",async (ctx,next) => {
  let q = ctx.request.query;
  console.log(q.limit =="");
  if(q.limit == "" || q.limit == ''){
    q.limit = 0;
  }
  if(isNaN(parseInt(q.limit))){
    ctx.data = "传入的limit值不正确"
    return next();
  }
  let resarr = await imgtype.getCreateNewArr(q.limit)
  let res = await imgtype.getIndexData(resarr);
  ctx.data = res;
  return next();
})

router.get('/getTopData', async (ctx,next) => {
  let q = ctx.request.query;
  if(q.pagesize == "" || q.pagesize == '' || q.pagesize == undefined){
    q.pagesize = 5;
  }
  if(isNaN(parseInt(q.pagesize))){
    ctx.data = "传入的pagesize值不正确"
    return next();
  }
  let res = await imgtype.getTopData(parseInt(q.pagesize),parseInt(q.curpage));
  ctx.data = res;
  return next()
})

router.get('/getHotData', async (ctx,next) => {
  let q = ctx.request.query;
  if(q.pagesize == "" || q.pagesize == '' || q.pagesize == undefined){
    q.pagesize = 5;
  }
  if(isNaN(parseInt(q.pagesize))){
    ctx.data = "传入的limit值不正确"
    return next();
  }
  let res = await imgtype.getHotData(parseInt(q.pagesize),parseInt(q.curpage));
  ctx.data = res;
  return next()
})


module.exports = router;
