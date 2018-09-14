var Sequelize = require("sequelize");
var sequelize = require("../db/dbInstance");


// id: {
//   type: Sequelize.INTEGER,
//   primaryKey: true,
//   autoIncrement: true,
// },
//创建model
var User = sequelize.define(
  "user",
  {
    username: {
      type: Sequelize.STRING, //指定类型
      field: "user_name" //指定存储在表中的键名称
    },
    mobile: {
      type: Sequelize.STRING
    }
  },
  {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    freezeTableName: false
  }
);

// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表（如果users表已存在）先销毁再创建表
// 默认情况下 forse = false
var user = User.sync({ forse: false });

//添加新用户
exports.addUser = (name, mobile) => {
  return User.create({
    username: name,
    mobile: mobile
  });
};

//通过用户名查找
exports.getUserInfo = (name) => {
  return User.findOne({ where: { user_name: name } });
};
