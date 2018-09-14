/**
 * 七牛文件服务
 */
const qiniu = require("qiniu");

const selfconf = require("../config/config");

class QiNiu {
  constructor() {
    let accessKey = selfconf.qiniu.accessKey;
    let secretKey = selfconf.qiniu.secretKey;
    this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let options = {
      scope: "doutub",
      expires: 864000000000
    };
    this.putPolicy = new qiniu.rs.PutPolicy(options);

    this.getToken();
    this.config = new qiniu.conf.Config();
    this.config.zone = qiniu.zone.Zone_z2;
    // 是否使用https域名
    //config.useHttpsDomain = true;
    // 上传是否使用cdn加速
    //config.useCdnDomain = true;
    this.formUploader = new qiniu.form_up.FormUploader(this.config);
    this.putExtra = new qiniu.form_up.PutExtra();
  }

  getToken() {
    this.uploadToken = this.putPolicy.uploadToken(this.mac);
    console.log("uploadToken......." + this.uploadToken);
  }
  async imgUpload(path, name) {
    let self = this;
    return new Promise((resolve, reject) => {
      let key = name;
      // 文件上传
      this.formUploader.putFile(
        this.uploadToken,
        key,
        path,
        this.putExtra,
        async function(respErr, respBody, respInfo) {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            resolve(respBody);
          } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
            if (respInfo.statusCode == 401) {
              //token 过期，重新请求token
              await self.getToken();
              reject(respBody)
            }else{
              reject(respBody);
            }
          }
        }
      );
    });
  }

  delImage(key) {
    return new Promise((resolve, reject) => {
      var bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
      var bucket = "doutub";
      var key = key;
      bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
        if (err) {
          console.log(err);
          reject(err);
          //throw err;
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
          resolve(respInfo);
        }
      });
    });
  }
}

let qniu = new QiNiu();
module.exports = qniu;
 