import express from "express";
import { getWarehouseAnalytics } from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:name", verifyJWT, getWarehouseAnalytics);

export default router;
