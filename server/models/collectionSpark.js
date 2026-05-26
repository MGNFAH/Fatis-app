const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Collection = require("./Collection");
const Spark = require("./Spark");

const CollectionSpark = sequelize.define(
  "CollectionSpark",
  {
    collectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sparkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ["collectionId"] }, { fields: ["sparkId"] }],
  },
);

module.exports = CollectionSpark;
