const Sequelize = require("sequelize");
const dbConfig = require("./db.confic");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: true,
});
// const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
//   host:dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   timezone:dbConfig.timezone,
//   dialectOptions:{
//     useUTC:false
//   }
// });

(async () => {
  await sequelize.authenticate();
})();

module.exports = sequelize;
