import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import router from "./routes/checker.route.js";
import db from "../config/db.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/api", router);

app.get("/", (req, res) => res.send("Express on Vercel"));

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("Database connected...");
    const port = process.env.APP_PORT || 3000;
    app.listen(port, () => {
      console.log(`Server berjalan di port ${port}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();

export default app;
