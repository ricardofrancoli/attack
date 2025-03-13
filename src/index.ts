import express from "express";
import db from "./db/initialise";
import { errorHandler } from "./middleware/error.middleware";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use(routes);

// Middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    await db.connect();

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
