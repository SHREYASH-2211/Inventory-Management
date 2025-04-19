import express from "express";
import {
  logMovement,
  getMovements,
  reverseMovement
} from "../controllers/stockMovement.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Uncomment if using JWT auth

const router = express.Router();

// Get all stock movement logs
router.get("/", verifyJWT, getMovements);

// Log a new stock movement (purchase/sale/transfer)
router.post("/", verifyJWT, logMovement);

// Reverse a specific stock movement
router.put("/reverse/:id", verifyJWT, reverseMovement);

export default router;
