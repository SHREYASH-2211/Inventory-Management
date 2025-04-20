import express from "express";
import {
  logMovement,
  getMovements,
  reverseMovement
} from "../controllers/stockMovement.controller.js";

const router = express.Router();

// router.post("/", logMovement);
// router.get("/", getMovements);
// router.put("/reverse/:id", reverseMovement);

// import { requireAuth, authorizeRoles } from "../middlewares/authMiddleware.js";

router.get("/",  getMovements);
router.post("/",  logMovement);
router.put("/reverse/:id", reverseMovement);

export default router;
