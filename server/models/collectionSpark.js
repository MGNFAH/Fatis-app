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

// Associazioni — dicono a Sequelize come fare il JOIN
CollectionSpark.belongsTo(Collection, { foreignKey: "collectionId" });
CollectionSpark.belongsTo(Spark, { foreignKey: "sparkId" });
Collection.hasMany(CollectionSpark, { foreignKey: "collectionId" });
Spark.hasMany(CollectionSpark, { foreignKey: "sparkId" });

module.exports = CollectionSpark;
