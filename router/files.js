const sequelize = require("../db/dbInstance");
const file = require("../model/files");
const Router = require("koa-router");
const multer = require('koa-multer');
const path = require('path');
const mk = require('../utils/mkdir')
const qniu = require('../utils/qiniu')
const qiniubaseurl = 'https://qn.doutub.com/'
// const upload = multer({ dest: path.join(process.cwd(),'/uploads/') });
const storage = multer.diskStorage({  
  //文件保存路径  
  destination: async function (req, file, cb) {  
    let theData = new Date();
    let targetPath = theData.getFullYear()+'-'+(theData.getMonth()+1)+'-'+theData.getDate();
    let relativePath ='/uploads/' + targetPath;
    let resultPath = path.join(process.cwd(),relativePath);
    await mk.mkdirs(resultPath,()=>{
      cb(null,resultPath)  
    })

    // cb(null,path.join(process.cwd(),'/uploads'))
  },  
  //修改文件名称  
  filename: function (req, file, cb) {  
    var fileFormat = (file.originalname).split("."); 
    let name = (Date.parse(new Date())/1000) + '' + (Math.round(Math.random()*9999)); 
    cb(null,name + "." + fileFormat[fileFormat.length - 1]);  
    // cb(null,file.originalname);
  }  
})  
//加载配置  
const upload = multer({ storage: storage });  

var router = new Router({
  prefix: "/file"
});

/**
 * 上传到七牛服务器
 */
router.post('/uploadToQiNiu', upload.single('avatar'), async (ctx, next) => {  
  console.log(ctx.req.file);
//将信息添加到数据库
// await file.addImage(ctx.req.file)
await qniu.imgUpload(ctx.req.file.path,ctx.req.file.filename).then(res => {
  ctx.data = {  
    imgName: ctx.req.file.filename,//返回文件名  
    imgPath:qiniubaseurl + ctx.req.file.filename,
  } 
}).catch(error => {
  ctx.data = '上传到七牛失败';
})

  return next(); 
}) 

router.post('/uploadMulterToQN',upload.array('avatar',12), async (ctx,next) => {
  console.log(ctx.req.files);
  let f = ctx.req.files;
  for(let i = 0;i<f.length;i++){
    await qniu.imgUpload(f[i].path,f[i].filename).then(da => {

    }).catch(error => {
      ctx.data = '上传到七牛失败';
      return next();
    })
    ctx.data = {  
      imgName: f[i].filename,//返回文件名  
      imgPath:qiniubaseurl + f[i].filename,
    } 
  }
  
  return next(); 
})

router.post("/addImg",async (ctx,next) => {
  console.log(ctx);
  let b = ctx.request.body;
  if(b){
    b.isgif = b.imgName.split('.')[1] =="gif"
  }
  let res = await file.addImage(b).then(res => {
    
  }).catch(err =>{
    console.log(err)
  })
  ctx.data = '添加成功';
  return next()
});
router.post('/delImg',async (ctx,next) => {
  let b = ctx.request.body;
  let res = await file.delImage(b.id);
  // qniu.delImage(b.name)
  console.log(res)
  ctx.data = res;
  return next();
})
router.get('/search',async (ctx,next) => {
  let q = ctx.request.query;
  if(q.keyword == "" || q.keyword == ''){
    ctx.data = "请输入查询关键字";
    return next();
  }
  let res = await file.search(q.keyword);
  ctx.data = res;
  return next();
})
router.get('/getNewImg', async (ctx,next) => {
  let q = ctx.request.query;
  if(isNaN(q.curpage) || isNaN(q.pagesize)){
    ctx.data = "传入的参数只能为数字";
    return next()
  }
  let res = await file.getNewBq(parseInt(q.pagesize) ,parseInt(q.curpage) );
  ctx.data = res;
  return next();
})

router.get('/getBqDetail', async (ctx,next) =>{
  let q = ctx.request.query;
  if(q.imgType){
    let res = await file.getBqDetail(q.imgType);
    ctx.data = res;
  }else{
    ctx.data = "传入参数有误"
  }
  return next()
})
// router.post('/mulUpload',upload.array('photos',4),async (ctx,next)=>{
//   console.log(ctx.files);
//   console.log(ctx);
//   ctx.data ='multerupload success';
//   return next();
// })

module.exports = router;