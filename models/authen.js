const Sequelize = require("sequelize");
const sequelize = require("../database/db_instance");
const authen = sequelize.define(
  "authen",
  {
    // attributes
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {}
);

(async () => {
  await authen.sync({ force: false });
})();

module.exports = authen;
