import "dotenv/config";

import app from "./app";
import { sequelize } from "./config/db";

const PORT = process.env.PORT;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connecté à la base de données");
    app.listen(PORT, () =>
      console.log(`🚀 Serveur sur http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la DB :", err);
    process.exit(1);
  });
