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
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server berjalan di port ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();

export default app;
