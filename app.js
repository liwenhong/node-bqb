'use strict';
process.env.UV_THREADPOOL_SIZE = 10;

const config = require('./config');
const koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');
const app = new koa();
const router = require('./router');

//允许跨域
app.use(cors());
//解析请求体
app.use(bodyParser({enableTypes: ['text', 'json', "form"]}));
app.use(router.routes(), router.allowedMethods());

//解析ipv4
app.listen(config.sys.port, '0.0.0.0', function () {
    console.log(`app start success listen ${config.sys.port}`);
});

// app.listen(3000, function () {
//     console.log(`app start success listen ${config.sys.port}`);
// });