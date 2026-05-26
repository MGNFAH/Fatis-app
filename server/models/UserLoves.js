const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserLove = sequelize.define("UserLove", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sparkId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = UserLove;
