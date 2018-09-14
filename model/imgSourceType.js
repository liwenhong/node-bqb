"use strict";

var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");
var imgSource = require("./imgSource")

var ImgSourceType = sequelize.define(
  "imgSourcetType",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    typename: {
      type: Sequelize.STRING,
      unique: true
    }
  },
  {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: true
  }
);

// imgFiles.IFiles.hasMany(ImgType);
var imgSourceType = ImgSourceType.sync({ forse: false }); //创建表

/**
 * 添加一级标题
 * @param {一级标题名称} typename 
 */
exports.addImgSourceType = (typename) => {
  return new Promise((resolve,reject) => {
    ImgSourceType.findOrCreate({ where: { typename: typename } }).spread(
      (imgtype, created) => {
        resolve(imgtype);
      }
    );
  })
}

/**
 * 获取所有一级标题
 */
exports.getSourceTypeList = () => {
  return new Promise((resolve,reject) => {
    ImgSourceType.findAll().then(res => {
      resolve(res)
    }).catch(error => {
      reject(error);
    })
  })
}

/**
 * 通过id 删除
 */
exports.delSourceType = (id) => {
  return new Promise((resolve,reject) => {
    sequelize.query('DELETE from imgSourcetType where id ='+id).then(res => {
      //此处应该还应删除素材表里 pid为ID的所有数据
      sequelize.query('DELETE from imgSource where pid ='+id);
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 通过ID更新素材类型
 * @param {类型ID} id 
 */
exports.updateSourceType = (id,newname) => {
  return new Promise((resolve,reject) => {
    ImgSourceType.update({typename:newname},{where:{id:id}}).then(async (res) =>{
      await imgSource.updateTypeName(id,newname).then(da => {
        console.log(da)
        resolve(da);
      })
    }).catch(error => {
      reject(error);
    })
  })
}
