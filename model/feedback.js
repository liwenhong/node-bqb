"use strict";

var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");
const Op = Sequelize.Op;

var FeedBack = sequelize.define(
  "feedBack",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    typeName: {
      type: Sequelize.STRING
    },
    describe: {
      type: Sequelize.STRING,
      defaultValue: ""
    },
    path: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    mobile: {
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
var feedback = FeedBack.sync({ forse: false }); //创建表

/**
 * 新增
 * @param {*} obj
 */
exports.add = obj => {
  return new Promise((resolve, reject) => {
    FeedBack.create({
      typeName: !!obj.typeName ? obj.typeName : "",
      describe: obj.describe,
      path: obj.path,
      email: !!obj.email ? obj.email : "",
      mobile: !!obj.mobile ? obj.mobile : ""
    }).then(res => {
        resolve(res);
      }).catch(error => {
        reject(error);
      });
  });
};
