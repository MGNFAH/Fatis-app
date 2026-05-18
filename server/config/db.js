const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // necessario per Supabase
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Supabase Postgres connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
