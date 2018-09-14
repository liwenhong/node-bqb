const bqList = require("../model/bqList");
const Router = require("koa-router");
var router = new Router({
  prefix: "/bq"
});

router.post("/add", async (ctx,next) => {
  let b = ctx.request.body;
  if(!!b){
    b.isGif = b.imgName.split('.')[1] =="gif"
    await bqList.add(b).then(res =>{
      console.log(res)
      ctx.data = "添加成功"
    }).catch(error =>{
      ctx.data = "添加失败";
    })
  }else{
    ctx.data = "添加失败"
  }
  return next();
})

router.get("/queryNewBq", async (ctx,next) => {
  let q = ctx.request.query;
  let isShowIndex = !!q.isShowIndex ? eval(q.isShowIndex.toLowerCase()):null;
  let pageSize = !!q.pageSize?parseInt(q.pageSize):10;
  let curPage = !!q.curPage?parseInt(q.curPage):1;
  // if(q.typeId == undefined || q.typeId == ''){
  //   ctx.data = "typeId参数必传"
  //   return next()
  // }
  let result = await bqList.queryNewBq(q.typeId,isShowIndex,pageSize,curPage);
  ctx.data = result;
  return next();
})

router.get("/querySerieBq", async (ctx,next) => {
  let q = ctx.request.query;
  let isHot =  eval(q.isHot.toLowerCase());
  let isTop =  eval(q.isTop.toLowerCase())
  let pageSize = !!q.pageSize?parseInt(q.pageSize):10;
  let curPage = !!q.curPage?parseInt(q.curPage):1;
  let result = await bqList.querySerieBq(isHot,isTop,pageSize,curPage);
  ctx.data = result;
  return next();
})

router.post("/delBq", async (ctx,next) => {
  let b = ctx.request.body;
  if(b.id){
   await bqList.delete(b.id).then(res => {
      ctx.data = "删除成功"
    }).catch(error => {
      ctx.data = "删除失败"
    })
  }else{
    ctx.data = "id不正确"
  }
  return next();
})

router.post("/delSerieBq", async (ctx,next) => {
  let b = ctx.request.body;
  if(b.serieId){
   await bqList.delSerieById(b.serieId).then(res => {
      ctx.data = "删除成功"
    }).catch(error => {
      ctx.data = "删除失败"
    })
  }else{
    ctx.data = "serieId不正确"
  }
  return next();
})

router.post("/updateBq", async (ctx,next) => {
  let b = ctx.request.body;
  if(b){
    await bqList.update(b).then(res => {
      ctx.data = "更新成功"
    }).catch(error => {
      ctx.data = "更新失败"
    })
  }else{
    ctx.data = "参数不正确"
  }
  return next()
})

router.get("/search",async(ctx,next) => {
  let q = ctx.request.query;
  if(q.keyword == "" || q.keyword == ''){
    ctx.data = "请输入查询关键字";
    return next();
  }
  if(q.curPage == "" || q.curPage == '' || q.curPage == undefined){
    q.curPage = 1
  }
  if(q.pageSize == "" || q.pageSize == '' || q.pageSize == undefined){
    q.pageSize = 200
  }
  let res = await bqList.search(q.keyword,parseInt(q.pageSize),parseInt(q.curPage) );
  ctx.data = res;
  return next();
})

router.post("/getSerieById", async (ctx,next) => {
  let b = ctx.request.body;
  if(b.serieId){
    let res = await bqList.checkDetailById(b.serieId);
    ctx.data = res;
  }else{
    ctx.data = "参数错误";
  }
  return next();

})

router.post("/getBqById", async (ctx,next) => {
  let b = ctx.request.body;
  if(b.id){
    let res = await bqList.getDetailById(b.id);
    ctx.data = res;
  }else{
    ctx.data = "参数错误";
  }
  return next();

})

module.exports = router;