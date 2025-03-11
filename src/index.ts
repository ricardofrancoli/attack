import express from "express";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/api", routes);

app.get("/ping", (req, res) => {
  res.send("OK!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
