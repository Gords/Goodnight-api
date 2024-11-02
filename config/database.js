const db = require("../models");

const connectDatabase = async (app, PORT) => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection established.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  }
};

module.exports = connectDatabase;