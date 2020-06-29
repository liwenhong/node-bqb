'use strict'
var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");
const Op = Sequelize.Op;

/**
 * ulink
 */

//创建model
var ULink = sequelize.define(
  "uLink",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    linkName: {
      type: Sequelize.STRING
    },
    linkUrl:{
      type:Sequelize.STRING
    },
    linkStatus: {
      type: Sequelize.STRING
    }
  },
  {
    // 如果为 true 则表的名称和 model 相同
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  }
);

// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表（如果users表已存在）先销毁再创建表
// 默认情况下 forse = false
var uLink = ULink.sync({ forse: false });

/**
 * 添加友联
 * @param {*} obj 
 */
exports.addULinkList = (obj) =>{
  return new Promise((resolve, reject) => {
    ULink.create({
      linkStatus: obj.linkStatus || '1',
      linkName: obj.linkName,
      linkUrl: obj.linkUrl
    }).then(res => {
      resolve(res)
    }).catch(e => {
      reject(e)
    })
  })
}

/**
 * 获取所有的友联
 */
exports.getAllUlinkInfo = () => {
  return new Promise((resolve, reject) => {
    ULink.findAndCountAll({where:{linkStatus: '1'}}).then(res => {
      resolve(res)
    }).catch(error=>{
      reject(error);
    })
  })
}
/**
 * 根据ID删除友联
 * @param {*} id 
 */
exports.delUlink = (id) => {
  return new Promise((resolve, reject) =>{
    sequelize.query('DELETE from uLink where id ='+id).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}



