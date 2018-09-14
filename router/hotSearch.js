const sequelize = require("../db/dbInstance");
const hotsearch = require("../model/hotSearch");
const Router = require("koa-router");
var router = new Router({
  prefix: "/search"
});

/**
 * 获取热门关键字
 */
router.get('/getkeyword', async (ctx,next) => {
  let q = ctx.request.query;
  if(isNaN(q.pageSize)){
    ctx.data = "输入的参数格式不正确";
    return next();
  }
  q.pageSize = (q.pageSize == "" || q.pageSize == '')?20:parseInt(q.pageSize) 
  let result = await hotsearch.searchKeyType(q.typeId,q.pageSize);
  ctx.data = result;
  return next();
})

/**
 * 添加关键字类型
 */
router.post('/addKeyWord', async (ctx,next) => {
  let b = ctx.request.body;
  let result = await hotsearch.addSearchKey(b)
  ctx.data = result;
  return next();
})

/**
 * 删除关键字
 */
router.post('/delKeyWord', async (ctx,next) => {
  let b = ctx.request.body;
  let idarr = b.arr.split(',')
  if(idarr.length>0){
    for(let i =0;i<idarr.length;i++){
      let result = await hotsearch.delSearchKey(idarr[i]);
    }
  }
  ctx.data = "删除成功";
  return next();
})

module.exports = router;