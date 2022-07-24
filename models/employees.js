const Sequelize = require("sequelize");
const sequelize = require("../database/db_instance");
const employees = sequelize.define(
  "employees",
  {
    // attributes
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    salary: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {}
);

(async () => {
  await employees.sync({ force: false });
})();

module.exports = employees;
