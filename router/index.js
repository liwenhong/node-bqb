const path = require('path');
const fs = require('fs');
const router = require('koa-router')();
const basename = path.basename(module.filename);

fs.readdirSync(__dirname).filter(file=>
    (file.indexOf('.') !== 0) && (file.split('.').slice(-1)[0] === 'js') && (file !== basename)
).forEach(file=> {
    const r = require(path.join(__dirname, file));
    router.use('/api', r.routes(), r.allowedMethods());

});

module.exports = router;