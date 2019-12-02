/**
 * Created by Administrator on 2017/10/27.
 */
// const api_host = `https://api.${你的域名}\${你的项目名\${api_version}`;//https://api.xxxxx.com/blog/v1
//api遵循restful设计，这里规定api返回结构
// const response = {
//   code: Number,
//   msg: String,
//   data: Object,
// };
const axios = require('axios');
const qs = require('qs')


const isDebug = true;
// axios.defaults.withCredentials = true;//支持跨域请求

// exports.http_request = (base_url,params,type='get') => {
//   //构建axios请求基础
//   const request = axios.create({
//     baseURL: base_url,
//     timeout: 15000,// 超时时间
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
//   });
//   //请求方法的构建,type为：get、post、delete等等
//   // const createRequestFuc = (type) => {
//     return function (resource, params) {
//       //返回请求的Promise的对象
//       return new Promise((resolve, reject) => {
//         if (type === 'post') {
//           params = qs.stringify(params);
//         }
//         params = type === 'get' ? { params } : params;
//         request[type](resource, params)//调用request
//           .then(res => {
//             if (isDebug) {
//               console.log(res.data);
//             }
//             if (res && res.data && res.status === 200) {//判断请求返回结果，code为判断值
//               resolve(res.data);//返回结果
//             } else {
//               reject(res.data);//无论上面是否执行，都应该reject，阻止代码继续执行
//             }
//           })
//           .catch((err) => {
//             console.log(err);
//             reject(err);//无论上面是否执行，都应该reject，阻止代码继续执行
//           });
//       });
//     }
//   // };
// }

// // export default MyPlugin;

// create an axios instance
// const service = axios.create({
//   // baseURL: process.env.BASE_API, // api 的 base_url
//   baseURL:'',
//   timeout: 15000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     return config
//   },
//   error => {
//     Promise.reject(error)
//   }
// )
// // response interceptor
// service.interceptors.response.use(
//   response => response.data,
//   error => {
//     console.log('err' + error) // for debug
  
//     return Promise.reject(error)
//   }
// )
axios
exports.get = (url,params) => {
  return new Promise((resolve,reject) => {
    axios.get(url, {
      params: !!params?params:''
    },{headers:{'Accept':'application/json; charset=utf-8'}})
    .then(function (response) {
      // console.log(response);
      resolve(response)
    })
    .catch(function (error) {
      console.log(error);
      reject(error)
    });
  })
  
}

// module.exports = service
