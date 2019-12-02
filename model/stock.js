var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");
const http = require('../service/axios')
const config = require('../config/config')

/**
 * 热搜关键字表/今日热门
 */

//创建model
var StockList = sequelize.define(
  "stockList",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    code:{
      type:Sequelize.STRING
    }
  },
  {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  }
);

// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表（如果users表已存在）先销毁再创建表
// 默认情况下 forse = false
var stocklist = StockList.sync({ forse: false });

/**
 * 查询所有股票
 */
exports.queryAllStock = () => {
  return new Promise((resolve,reject) => {
    StockList.findAll().then(res => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * 新增
 * @param {*} obj
 */
exports.add = obj => {
  return new Promise((resolve, reject) => {
    StockList.create({
      name: !!obj.name?obj.name:'',
      code: !!obj.code ? obj.code: ''
    }).then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};
exports.getSort = (result) => {
  return new Promise(async(resolve,reject) => {
    let res = []
    for(let i =0;i<result.length;i++){
      if(res.length >=30){
        resolve(res)
        break;
      } 
      ((a)=> {
          setTimeout(async()=> {
            // console.log(a)
            let stockInfo = await http.get(config.stock.popularity,{code: result[i].code})
            if(stockInfo.status === 200 && stockInfo.data && stockInfo.data.status_code === 0 && stockInfo.data.data.popularity<31){
              let obj = {
                name: result[i].name,
                code: result[i].code,
                popularity: stockInfo.data.data.popularity
              }
              res.push(obj)
            }
          }, a*2000); 
      })(i)
    }
  })
}