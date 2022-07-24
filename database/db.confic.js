module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "DbName",
  dialect: "mysql",
  timezone: "asia/bangkok",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
