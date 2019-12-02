var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");
const Op = Sequelize.Op;

/**
 * gif模版
 */

//创建model
var GifSource = sequelize.define(
  "gifsource",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    gifId: {
      type: Sequelize.STRING
    },
    gifType:{
      type:Sequelize.STRING
    },
    gifPath:{
      type:Sequelize.STRING
    },
    gifName:{
      type:Sequelize.STRING
    },
    gifContent:{
      type:Sequelize.STRING
    },
    gifTime:{
      type:Sequelize.STRING
    },
    gifStatus:{
      type:Sequelize.STRING
    },
    showIndex: {
      type: Sequelize.BOOLEAN
    },
    splitMark: {
      type: Sequelize.STRING
    },
    color:{
      type: Sequelize.STRING
    },
    gifDesc:{
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

// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表（如果users表已存在）先销毁再创建表
// 默认情况下 forse = false
var gifsource = GifSource.sync({ forse: false });

/**
 * 添加gif模版
 * @param {*} obj 
 */
exports.addGifSource = (obj) =>{
  return new Promise((resolve, reject) => {
    GifSource.create({
      gifId:obj.gifId,
      gifType: !!obj.gifType ? obj.gifType : '1',
      gifPath: obj.gifPath,
      gifName: obj.gifName,
      gifContent:obj.gifContent,
      gifTime: !!obj.gifTime ? obj.gifTime: '1000',
      gifStatus: !!obj.gifStatus ? obj.gifStatus : '1',
      showIndex: obj.showIndex === 'true' ? true : false,
      splitMark: obj.splitMark ? obj.splitMark : '',
      color: obj.color ? obj.color: '#000',
      gifDesc: obj.gifDesc ? obj.gifDesc : ''
    }).then(res => {
      resolve(res)
    }).catch(e => {
      reject(e)
    })
  })
   
}

/**
 * 删除gif模版
 * @param {待删除的gif模版id/name} key 
 */
exports.delGifSource = (key) =>{
  return new Promise((resolve,reject) => {
    sequelize.query('DELETE from gifsource where gifId ='+ key).then(res => {
      resolve(res);
    }).catch((error) => {
      reject(error);
    })
  })
}

/**
 * 搜索gif
 * @param {关键字类型} gifId 
 * @param {数量} pagesize 
 */
exports.searchGifSourceByGifId = (gifId, pagesize) => {
  return new Promise((resolve,reject) => {
    GifSource.findAndCountAll({where:{gifId:gifId},limit:pagesize, order: sequelize.literal("createdAt DESC")}).then(res => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

/**
 * 查找gif
 */
exports.getGifSource = (curPage = 1, pageSize = 10, gifName) => {
  return new Promise((resolve, reject) => {
    curPage && (curPage = parseInt(curPage))
    pageSize && (pageSize = parseInt(pageSize))
    GifSource.findAndCountAll({attributes:['gifId'],group:'gifId',order:sequelize.literal("gifId DESC"),limit:pageSize,offset:pageSize*(curPage-1), where: {gifName: {[Op.like]: !!gifName ? '%'+gifName + '%': '%%'}} }).then(async res  => {
      let result = {
        total:0,
        lists:[]
      };
      for(let i = 0;i<res.rows.length;i++){
        let temp ={
          id: new Date().getTime(),
          gifId:res.rows[i].dataValues.gifId,
          gifName:'',
          total:0,
          gifDesc: '',
          children:[]
        }
        await getGifDetail(res.rows[i].dataValues.gifId).then(da => {
          temp.children = (da.rows);
          temp.total = da.count;
          if(da.rows.length>0){
            temp.gifName = da.rows[0].gifName;
            temp.gifDesc = da.rows[0].gifDesc;
          }
        })
        await getTotalGifSource().then(r => {
          result.total = r
        })
        result.lists.push(temp)
      }
      resolve(result)

    }).catch(e => {
      console.log(e)
      reject(e)
    })
  })
}
function getGifDetail(gifId){
  return new Promise((resolve,reject) => {
    GifSource.findAndCountAll({where:{[Op.and]:[{gifId:gifId}, {showIndex: {[Op.eq]:true}}]}}).then(res => {
      resolve(res)
    }).catch(error=>{
      reject(error);
    })
  })
}
function getTotalGifSource(){
  return new Promise((resolve,reject) => {
    sequelize.query("select count(*) as count from (select gifId from gifSource group by gifId) count", { type: sequelize.QueryTypes.SELECT})
    .then(res => {
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

exports.getGifDetailList = (gifId) => {
  return new Promise((resolve,reject) => {
    GifSource.findAndCountAll({where:{gifId:gifId}}).then(res => {
      resolve(res)
    }).catch(error=>{
      reject(error);
    })
  })
}

/**
 * 更新
 * @param {} object 
 */
exports.update = (object)=>{
  return new Promise((resolve,reject) =>{
    GifSource.update({
      gifName: object.gifName,
      gifContent:object.gifContent,
      gifTime:object.gifTime,
      showIndex:object.showIndex === 'true' ? true : false,
      splitMark:object.splitMark,
      color: object.color,
      gifDesc: object.gifDesc
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
 * 根据ID删除单个的表情
 * @param {*} id 
 */
exports.delete = (id) => {
  return new Promise((resolve,reject) => {
    sequelize.query('DELETE from gifsource where id ='+id).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}