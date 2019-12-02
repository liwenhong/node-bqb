const sequelize = require("../db/dbInstance");
const stock = require("../model/stock");
const Router = require("koa-router");
const config = require('../config/config')
const http = require('../service/axios')
const ApiError = require('../error/apiError');

var router = new Router({
  prefix: "/stock"
});
router.post("/add", async (ctx,next) => {
  let b = ctx.request.body;
  if(!!b){
    await stock.add(b).then(res =>{
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
/**
 * 获取股票列表
 */
router.get('/getAllStockList', async (ctx,next) => {
  let q = ctx.request.query;
  let result = await stock.queryAllStock();
  if(!!result && result.length>0){
    let res = await stock.getSort(result)
    // let res = []
    // for(let i =0;i<result.length;i++){
    //   if(res.length >=30) break;
    //   ((a)=> {
    //       setTimeout(async()=> {
    //         console.log(a)
    //         // let stockInfo = await http.get(config.stock.popularity,{code: result[i].code})
    //         // if(stockInfo.status === 200 && stockInfo.data && stockInfo.data.status_code === 0 && stockInfo.data.data.popularity<31){
    //         //   let obj = {
    //         //     name: result[i].name,
    //         //     code: result[i].code,
    //         //     popularity: stockInfo.data.data.popularity
    //         //   }
    //         //   res.push(obj)
    //         // }
    //       }, a*2000); 
    //   })(i)
    // }
    ctx.data = res
  }else{
    ctx.data = [];
  }
  return next();
})
router.get('/test',async (ctx,next) => {
  
 let result = await http.get(config.stock.popularity,{code:'002252'})
 if(result.status === 200 && result.data && result.data.status_code === 0){
  ctx.data = result.data.data
  return next()
 }else{
    throw new ApiError({
      code: -1,
      message: '查询失败'
    });
 }
  
})

router.get('/getStockList',async (ctx,next) => {
  
  // let result = await http.get(config.stock.stockList)
  // if(result.status === 200 && result.data ){
    
  //  ctx.data = result.data
  //  return next()
  // }else{
  //    throw new ApiError({
  //      code: -1,
  //      message: '查询失败'
  //    });
  // }
   
 })
module.exports = router;