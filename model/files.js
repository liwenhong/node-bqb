"use strict";
const Sequelize = require("sequelize");
const sequelize = require("../db/dbInstance");

const Op = Sequelize.Op;

var ImgFiles = sequelize.define("imgfiles", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: Sequelize.STRING,
  imgUrl: Sequelize.STRING,
  imgTitle: Sequelize.STRING,
  imgContent: Sequelize.STRING,
  imgType: Sequelize.STRING,
  imgName:Sequelize.STRING,
  uid:Sequelize.STRING,
  isgif:{
    type:Sequelize.BOOLEAN,
    defaultValue:false
  },
  downTime: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  ishot:{
    type:Sequelize.BOOLEAN,
    defaultValue:false
  },
  istop:{
    type:Sequelize.BOOLEAN,
    defaultValue:false
  },
  searchKey:Sequelize.STRING
  // isShow: {
  //   type: Sequelize.BOOLEAN,
  //   defaultValue: false
  // }
});

exports.IFiles = ImgFiles;

var imgFiles = ImgFiles.sync({ forse: true }); //创建表

exports.addImage = imgObj => {
  return ImgFiles.create({
    userId: imgObj.userId,
    imgUrl: imgObj.image_uri,
    imgTitle: imgObj.title,
    imgContent: imgObj.content,
    imgType: imgObj.imgType,
    imgName:imgObj.imgName,
    uid: imgObj.uid,
    isgif: imgObj.isgif,
    ishot:imgObj.ishot,
    istop:imgObj.istop,
    searchKey:imgObj.searchKey
  });
};

exports.delImage = (uid) => {
  
  sequelize.query('DELETE from imgfiles where uid ='+uid).then(res => {
    return res
  }).catch(err => {
    return '删除失败'
  })
}

/**
 * 
 * @param {搜索关键字} keyword 
 */
exports.search = (keyword) => {
  return new Promise((resolve,reject) => {
    try{
      ImgFiles.findAll({where:{  [Op.or]: [
        {
          searchKey: {
            [Op.like]: '%'+ keyword+'%'
          }
        },
        {
          imgContent: {
            [Op.like]: '%'+ keyword+'%'
          }
        }
      ]}}).then(res => {
        resolve(res);
      })
    }catch(error){
      reject(error)
    }
  })
}

/**
 * 获得最新的表情
 * @param {查询数量大小} pagesize 
 * @param {查询页数} curpage 
 */
exports.getNewBq = (pagesize,curpage) => {
  return new Promise((resolve,reject) => {
    try{
      ImgFiles.findAndCount({limit:pagesize,offset:pagesize*(curpage-1), order: sequelize.literal("updatedAt DESC"),where:{ishot:false,istop:false}}).then(res => {
        resolve(res);
      })
    }catch(error){
      reject(error)
    }
  })
 
}

/**
 * 获取系列表情的全部图片
 * @param {表情类型} imgType 
 */
exports.getBqDetail = (imgType) =>{
  return new Promise((resolve,reject) =>{
    ImgFiles.findAll({where:{imgType:imgType}}).then(res =>{
      resolve(res)
    }).catch(error =>{
      reject(error)
    })
  })
}
