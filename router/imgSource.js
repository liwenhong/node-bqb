const imgSource = require("../model/imgSource");
const Router = require("koa-router");
var router = new Router({
  prefix: "/imgsource"
});

router.post('/addImgSource', async (ctx,next) => {
  let b = ctx.request.body;
  if(b.typename){
    let res = await imgSource.addImgSource(b)
    ctx.data = res;
  }else{
    ctx.data = "输入的参数不正确"
  }
  return next();
})

router.get('/getSubTitleList', async (ctx,next) => {
  let q = ctx.request.query;
  if(q.id){
    let res = await imgSource.getSubImgType(q.id);
    ctx.data = res;
  }else{
     ctx.data = "传入的参数有误"
  }
  return next();
})

router.get('/getSourceList', async (ctx, next) => {
  let q = ctx.request.query;
  if(q.pid && q.name){
    let res = await imgSource.getSourceList(q.pid,q.name);
    ctx.data = res;
  }else{
    ctx.data = "输入的参数不正确"
  }
  return next();
})

router.get('/getSource', async (ctx,next) =>{
  let q = ctx.request.query;
  let res = await imgSource.getSource(parseInt(q.pagesize),parseInt(q.curpage));
  ctx.data = res;
  return next();
})

router.post('/delSource', async (ctx,next) => {
  let b = ctx.request.body;
  let res = await imgSource.delSource(b.id);
  ctx.data = res;
  return next();
})

router.post('/updateSource',async (ctx,next) =>{
  let b = ctx.request.body;
  if(b.obj){
    await imgSource.updateSource(b.obj).then(res =>{
      ctx.data = '更新成功'
    }).catch(error => {
      ctx.data = '更新失败'
    })
  }else{
    ctx.data = '参数错误'
  }
  return next();
})
module.exports = router;