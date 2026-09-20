import app from "./app";
import { sequelize } from "./config/db";
import getEnv from "./utils/envHelper";

const PORT = Number(getEnv("PORT"));

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to database");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });
