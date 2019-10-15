"use strict";

var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");
const Op = Sequelize.Op;

var BqList = sequelize.define(
  "bqList",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    typeId: {
      type: Sequelize.INTEGER
    },
    serieId: {
      type: Sequelize.STRING
    },
    serieName: {
      type: Sequelize.STRING
    },
    imgDescribe: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    imgName:{
      type:Sequelize.STRING
    },
    path: {
      type: Sequelize.STRING
    },
    searchKey: {
      type: Sequelize.STRING
    },
    uid: {
      type: Sequelize.STRING
    },
    isGif: {
      type: Sequelize.STRING
    },
    isHot: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isTop: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    isShowIndex: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    serieDescrib: {
      type: Sequelize.STRING
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
var bqlist = BqList.sync({ forse: false }); //创建表

/**
 * 新增
 * @param {*} obj
 */
exports.add = obj => {
  return new Promise((resolve, reject) => {
    BqList.create({
      typeId: obj.typeId,
      serieId: !!obj.serieId ? obj.serieId : "",
      serieName: !!obj.serieName ? obj.serieName : "",
      imgDescribe: obj.imgDescribe,
      path: obj.path,
      searchKey: !!obj.searchKey ? obj.searchKey : "",
      uid: obj.uid,
      isGif: obj.isGif,
      isHot: !!obj.isHot ? obj.isHot : false,
      isTop: !!obj.isTop ? obj.isTop : false,
      isShowIndex: !!obj.isShowIndex ? obj.isShowIndex : false,
      imgName: !!obj.imgName ? obj.imgName : '',
      serieDescrib: !!obj.serieDescrib ? obj.serieDescrib: ''
    }).then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * 查询最新表情
 * @param {是否查询显示在首页的表情} isShowIndex 
 */
exports.queryNewBq = (typeId,isShowIndex,pageSize = 10,curPage = 1) => {
  return new Promise((resolve,reject) => {
    let d = {}
    if(!!typeId && typeId != ''){
      d.typeId = typeId
    }
    if(!!isShowIndex){
      d.isShowIndex = isShowIndex
    }
    console.log(d)
    BqList.findAndCountAll({limit:pageSize,offset:pageSize*(curPage-1), order: sequelize.literal("updatedAt DESC"),where:d}).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    })
  })
}

/**
 * 查询系列
 * @param {是否热门} isHot 
 * @param {是否置顶} isTop 
 * @param {页面大小} pageSize 
 * @param {当前页} curPage 
 */
exports.querySerieBq = (isHot = false,isTop = false,pageSize=5,curPage = 1) => {
  return new Promise((resolve,reject) => {
    BqList.findAndCountAll({attributes:['serieId'],group:'serieId',order:sequelize.literal("serieId DESC"),limit:pageSize,offset:pageSize*(curPage-1),where:{[Op.and]: [{isHot: isHot}, {isTop: isTop},{serieId:{[Op.ne]:''}}]}}).then(async (res) => {
      let result = {
        total:0,
        lists:[]
      };
      // console.log('.............');
      console.log(res);
      // result.total = res.count.length>0? res.count[0].count : 0;
      for(let i = 0;i<res.rows.length;i++){
        let temp ={
          serieId:res.rows[i].dataValues.serieId,
          serieName:'',
          serieDescrib: '',
          total:0,
          data:[]
        }
        await getSerieDetail(res.rows[i].dataValues.serieId).then(da => {
          temp.data = (da.rows);
          temp.total = da.count;
          if(da.rows.length>0){
            temp.serieName = da.rows[0].serieName;
            temp.serieDescrib = !!da.rows[0].serieDescrib? da.rows[0].serieDescrib: ''
          }
        })
        await getTotalSerie(isHot,isTop).then(r => {
          console.log(r)
          result.total = r
        })
        result.lists.push(temp)
      }
      resolve(result);
    }).catch(error => {
      reject(error);
    })
  })
}

function getSerieDetail(serieId){
  return new Promise((resolve,reject) => {
    BqList.findAndCountAll({where:{serieId:serieId},limit:5,offset:0}).then(res => {
      resolve(res)
    }).catch(error=>{
      reject(error);
    })
  })
}
function getTotalSerie(isHot,isTop){
  return new Promise((resolve,reject) => {
    sequelize.query("select count(*) as count from (select serieId from bqList where isHot="+isHot+" and isTop="+isTop+" and serieId != '' group by serieId) count", { type: sequelize.QueryTypes.SELECT})
    .then(res => {
      console.log(res)
      if(res && res.length>0){
        resolve(res[0].count)
      }else{
        resolve(0)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 根据ID删除单个的表情
 * @param {*} id 
 */
exports.delete = (id) => {
  return new Promise((resolve,reject) => {
    sequelize.query('DELETE from bqList where id ='+id).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 删除系列
 * @param {系列ID} serieId 
 */
exports.delSerieById = (serieId) => {
  return new Promise((resolve,reject) => {
    sequelize.query('DELETE from bqList where serieId ='+serieId).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 更新
 * @param {} object 
 */
exports.update = (object)=>{
  return new Promise((resolve,reject) =>{
    BqList.update({
      serieName: object.serieName,
      imgDescribe:object.imgDescribe,
      path:object.path,
      imgName:object.imgName,
      searchKey:object.searchKey,
      isHot:object.isHot,
      isTop:object.isTop,
      isShowIndex :object.isShowIndex
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

/**
 * 
 * @param {搜索关键字} keyword 
 */
exports.search = (keyword,pageSize,curPage) => {
  return new Promise((resolve,reject) => {
    try{
      BqList.findAndCountAll({order: sequelize.literal("updatedAt DESC"),limit:pageSize,offset:pageSize*(curPage-1),where:{  [Op.or]: [
        {
          searchKey: {
            [Op.like]: '%'+ keyword+'%'
          }
        },
        {
          imgDescribe: {
            [Op.like]: '%'+ keyword+'%'
          }
        },
        {
          imgName: {
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

exports.checkDetailById = (serieId) => {
  return new Promise((resolve,reject) => {
    BqList.findAll({where:{serieId:serieId}}).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    })
  })
}

//根据id查找单个的内容
exports.getDetailById = (id) => {
  return new Promise((resolve,reject) => {
    BqList.findAll({where:{id:id}}).then(res => {
      resolve(res);
    }).catch(error => {
      reject(error);
    })
  })
}