"use strict";

var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");

var ImgSource = sequelize.define(
  "imgSource",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    typename: {
      type: Sequelize.STRING,
    },
    name:Sequelize.STRING,
    pid:Sequelize.INTEGER,//父级类型ID
    path:Sequelize.STRING,//素材路径
    sourceKey:Sequelize.STRING,//素材关键字，便于查询
    imgName:Sequelize.STRING
  },
  {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  }
);

exports.iSource = ImgSource;
// imgFiles.IFiles.hasMany(ImgType);
var imgSource = ImgSource.sync({ forse: false }); //创建表

/**
 * 添加素材
 * @param {*} object 
 */
exports.addImgSource = (object) => {
  return new Promise((resolve,reject) => {
    ImgSource.create(object).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error);
    })
  })
}

/**
 * 通过父id 查询二级标题组
 * @param {父id} id 
 */
exports.getSubImgType = (id) => {
  return new Promise((resolve,reject) => {
    ImgSource.findAll({order: sequelize.literal("createdAt ASC"),attributes: ['name', 'pid'],group:'name',where:{pid:id}}).then(res =>{
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}


/**
 * 通过父级类型ID和二级名称获得该条件下所有的素材
 * @param {父级类型ID} pid 
 * @param {二级名称} name 
 */
exports.getSourceList = (pid,name) =>{
  return new Promise((resolve,reject) => {
    ImgSource.findAll({order: sequelize.literal("createdAt ASC"),where:{pid:pid,name:name}}).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过素材ID修改素材名称的值
 * @param {素材类型ID} pid 
 * @param {待更换的名称} newname 
 */
exports.updateTypeName = (pid,newname) =>{
  return new Promise((resolve,reject) =>{
    ImgSource.update({typename:newname},{where:{pid:pid}}).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error)
    })
  })
}

exports.getSource = (pagesize=15,curpage=1) => {
 return new Promise((resolve,reject) => {
   ImgSource.findAndCountAll({limit:pagesize,offset:pagesize*(curpage-1),order: sequelize.literal("createdAt ASC")}).then(res => {
     resolve(res);
   }).catch(error => {
     reject(error);
   })
 })
}

exports.delSource = (id) => {
  return new Promise((resolve,reject) => {
    sequelize.query('DELETE from imgSource where id ='+id).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 更新搜财资源
 * @param {} object 
 */
exports.updateSource = (object)=>{
  return new Promise((resolve,reject) =>{
    ImgSource.update({
      typename: object.typename,
      name:object.name,
      path:object.path,
      imgName:object.imgName,
      sourceKey:object.sourceKey
    }, {
      where: {
        id: object.id
      }
    }).then(res =>{
      resolve(res)
    }).catch(error =>{
      reject(error)
    })
  })
}


