var config = require("../config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  // config.database,
  // config.username,
  // config.password,
  'bqb',
  'root',
  '123456',
  {
    host: 'localhost',
    dialect: "mysql",
    dialectOptions: {
      // socketPath: '/tmp/mysql.sock' // 指定套接字文件路径
    },
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    operatorsAliases: false
  }
);

module.exports = sequelize;
