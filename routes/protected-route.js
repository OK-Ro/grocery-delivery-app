import express from "express";
import authenticate from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/protected-route", authenticate, (req, res) => {
  res.json({ message: "This is a protected route" });
});

export default router;
