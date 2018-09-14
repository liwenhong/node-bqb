"use strict";

var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");
var imgFiles = require("./files")

var ImgType = sequelize.define(
  "imgtype",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    typename: {
      type: Sequelize.STRING,
      unique: true
    },
    ishot:{
      type:Sequelize.BOOLEAN,
      defaultValue:false
    },
    istop:{
      type:Sequelize.BOOLEAN,
      defaultValue:false
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
var imgtype = ImgType.sync({ forse: false }); //创建表

exports.addImgType = (name,ishot,istop) => {
  /**
   * findOrCreate 返回一个包含已找到或创建的对象的数组，找到或创建的对象和一个布尔值，如果创建一个新对象将为true，否则为false
   */
  return new Promise((resolve, reject) => {
    ImgType.findOrCreate({ where: { typename: name },defaults: {ishot:ishot,istop:istop} }).spread(
      (imgtype, created) => {
        resolve(imgtype);
      }
    );
  });
};

exports.getCreateNewArr = (limit) => {
  return new Promise((resolve, reject) => {
    try{
      if(limit == 0){
        //查询全部
        ImgType.findAll({ order: sequelize.literal("id DESC")}).then(
          res => {
            resolve(res);
          }
        );
      }else{
        ImgType.findAll({ order: sequelize.literal("id DESC"), limit: parseInt(limit) }).then(
          res => {
            console.log(res);
            resolve(res);
          }
        );
      }
      
    }catch(error){
      reject(error)
    }
    
  });
};

exports.getIndexData = arr => {
  return new Promise(async (resolve, reject) => {
    try{
      let result = []
      for (let i = 0; i < arr.length; i++) {
        let tempObj = {
          id:arr[i].dataValues.id,
          name:arr[i].dataValues.typename,
          data:[]
        }
        console.log(arr[i].dataValues);
       await imgFiles.IFiles.findAll({
         where:{imgtype: arr[i].dataValues.id}
        }).then(res => {
          console.log(res);
          tempObj.data = res;
          result.push(tempObj);
        })
      }
      resolve(result);
    }catch(error){
      reject(error)
    }
 
  });
};


/**
 * 获得置顶数据
 * @param {*} limit 
 */
exports.getTopData = (pagesize,curpage) => {
  return new Promise((resolve,reject) => {
    ImgType.findAndCountAll({where:{istop:true},order: sequelize.literal("updatedAt DESC"),limit:pagesize,offset:pagesize*(curpage-1)}).then(async (arr) => {
      let result = {count:arr.count,data:[]}
      for (let i = 0; i < arr.rows.length; i++) {
        let tempObj = {
            id:arr.rows[i].dataValues.id,
            name:arr.rows[i].dataValues.typename,
            data:[]
            
        }
       await imgFiles.IFiles.findAll({
         where:{imgtype: arr.rows[i].dataValues.id},limit:1,order: sequelize.literal("updatedAt DESC")
        }).then(res => {
          tempObj.data = res;
          result.data.push(tempObj);
        })
      }
      resolve(result);
    }).catch((error) => {
      reject(error);
    })
  })
}

/**
 * 获取热门数据
 * @param {*} limit 
 */
exports.getHotData = (pagesize,curpage) => {
  return new Promise((resolve,reject) => {
    ImgType.findAndCountAll({where:{ishot:true},order: sequelize.literal("updatedAt DESC"),limit:pagesize,offset:pagesize*(curpage-1)}).then(async (arr) => {
      let result = {count:arr.count,data:[]}
      for (let i = 0; i < arr.rows.length; i++) {
        let tempObj = {
          id:arr.rows[i].dataValues.id,
          name:arr.rows[i].dataValues.typename,
          data:[]
        }
       await imgFiles.IFiles.findAll({
         where:{imgtype: arr.rows[i].dataValues.id},order: sequelize.literal("updatedAt DESC")
        }).then(res => {
          tempObj.data = res;
          result.data.push(tempObj);
        })
      }
      resolve(result);
    }).catch((error) => {
      reject(error);
    })
  })
}

/**
 * 删除该类型
 * @param {类型id} id 
 */
exports.delImgType = (id) => {
  return new Promise((resolve,reject) => {
    sequelize.query('DELETE from imgtype where id ='+id).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}
