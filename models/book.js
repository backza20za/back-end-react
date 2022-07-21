const Sequelize = require("sequelize");
const sequelize = require("../database/db_instance");
const book = sequelize.define(
  "book",
  {
    // attributes
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "-",
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      // allowNull defaults to true
    },
  },
  {}
);

(async () => {
  await book.sync({ force: false });
})();

module.exports = book;
