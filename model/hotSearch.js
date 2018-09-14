var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");

/**
 * 热搜关键字表/今日热门
 */

//创建model
var HotSearch = sequelize.define(
  "hotsearch",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    typeId: {
      type: Sequelize.STRING
    },
    typeName:{
      type:Sequelize.STRING
    },
    searchKey:{
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
var hotsearch = HotSearch.sync({ forse: false });

/**
 * 添加搜索关键字
 * @param {*} obj 
 */
exports.addSearchKey = (obj) =>{
  return HotSearch.create({
    typeId:obj.typeId,
    typeName:obj.typeName,
    searchKey:obj.searchKey
  })
}

/**
 * 删除关键字
 * @param {待删除的关键字id} id 
 */
exports.delSearchKey = (id) =>{
  return new Promise((resolve,reject) => {
    sequelize.query('DELETE from hotsearch where id ='+id).then(res => {
      resolve(res);
    }).catch((error) => {
      reject(error);
    })
  })
}

/**
 * 搜索关键字
 * @param {关键字类型} typeid 
 * @param {数量} pagesize 
 */
exports.searchKeyType = (typeid,pagesize) => {
  return new Promise((resolve,reject) => {
    HotSearch.findAndCountAll({where:{typeId:typeid},limit:pagesize, order: sequelize.literal("createdAt DESC")}).then(res => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
