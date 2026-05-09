require("dotenv").config();
const { sequelize } = require("./config/db");
const Item = require("./models/Item");

const sampleItems = [
  { name: "First Item", description: "First item in our collection" },
  { name: "Second Item", description: "Second item in our collection" },
  { name: "Third Item", description: "Third item in our collection" },
];

(async () => {
  try {
    await sequelize.sync({ force: true });
    await Item.bulkCreate(sampleItems);
    console.log("Database seeded successfully");
    await sequelize.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
})();
