import express from "express";
import { getWarehouseAnalytics } from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Parser } from "json2csv";

import { requireAuth, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  getInventoryTrends,
  getFastSlowMovingItems,
  getInventoryValuation,
  exportInventoryCSV
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/trends", requireAuth, authorizeRoles("admin", "manager","staff"), getInventoryTrends);
router.get("/fast-slow", requireAuth, authorizeRoles("admin", "manager","staff"), getFastSlowMovingItems);
router.get("/valuation", requireAuth, authorizeRoles("admin", "manager"), getInventoryValuation);
router.get("/export/csv", requireAuth, authorizeRoles("admin", "manager"), exportInventoryCSV);



//router.get("/:name", verifyJWT, getWarehouseAnalytics);


router.get("/:warehouseName", requireAuth, authorizeRoles("admin", "manager"), getWarehouseAnalytics);

export default router;
