const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Spark = sequelize.define("Spark", {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const User = require("./User");
Spark.belongsTo(User, { foreignKey: "userId" });

module.exports = Spark;
