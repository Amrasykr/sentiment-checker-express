import { check } from "../controllers/checker.controller.js";
import { rulesValidator } from "../middlewares/rulesValidator.js";
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, this is the checker route da");
});

router.post("/check", rulesValidator, check);

export default router;
