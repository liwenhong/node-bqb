const gifSource = require("../model/gifSource");
const Router = require("koa-router");
const ApiError = require('../error/apiError');
var router = new Router({
  prefix: "/gif"
});

router.post("/addGifSource", async (ctx,next) => {
  let b = ctx.request.body;
  if(!!b.gifName && !!b.gifContent && !!b.gifPath){
    await gifSource.addGifSource(b).then(res =>{
      console.log(res)
      ctx.data = "添加成功"
    }).catch(error =>{
      throw new ApiError({
        code: -1,
        message: '添加失败'
      });
    })
  }else{
    // throw new ApiError({
    //   code: -1,
    //   message: '请传入正确的参数'
    // });
    ctx.data = {
        code: -1,
        msg: '请传入正确的参数',
    }
  }
  return next();
})
router.get("/getGifSource", async (ctx, next) => {
  let q = ctx.request.query
  let res = await gifSource.getGifSource(q.curPage, q.pageSize, q.gifName)
  ctx.data = res
  return next()
})
router.get("/getGifDetail", async (ctx, next) => {
  let q = ctx.request.query
  let res = await gifSource.getGifDetailList(q.gifId)
  ctx.data = res
  return next()
})
router.post('/updateGifDetail', async (ctx, next) => {
  let b = ctx.request.body;
  let res = await gifSource.update(b)
  ctx.data = res
  return next()
})
router.post("/delGif", async (ctx,next) => {
  let b = ctx.request.body;
  if(b.id){
   await gifSource.delete(b.id).then(res => {
      ctx.data = "删除成功"
    }).catch(error => {
      ctx.data = "删除失败"
    })
  }else{
    ctx.data = "id不正确"
  }
  return next();
})
router.post("/delGifSource", async (ctx,next) => {
  let b = ctx.request.body;
  if(b.gifId){
   await gifSource.delGifSource(b.gifId).then(res => {
      ctx.data = "删除成功"
    }).catch(error => {
      ctx.data = "删除失败"
    })
  }else{
    ctx.data = "gifId不正确"
  }
  return next();
})


module.exports = router;