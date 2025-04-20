import express from "express";
import {
  createWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
    getTotalQuantityByWarehouse
} from "../controllers/warehouse.controller.js";
// import { requireRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// router.get("/", getWarehouses);
// router.post("/", /* requireRole("admin", "manager"), */ createWarehouse);
// router.put("/:id", /* requireRole("admin", "manager"), */ updateWarehouse);
// router.delete("/:id", /* requireRole("admin"), */ deleteWarehouse);
// router.get("/total-quantity/:name", getTotalQuantityByWarehouse);
import { requireAuth, authorizeRoles } from "../middlewares/authMiddleware.js";

router.get("/", requireAuth, getWarehouses);
router.post("/", requireAuth, authorizeRoles("admin", "manager"), createWarehouse);
router.put("/:id", requireAuth, authorizeRoles("admin", "manager"), updateWarehouse);
router.delete("/:id", requireAuth, authorizeRoles("admin"), deleteWarehouse);
router.get("/total-quantity/:name", requireAuth, getTotalQuantityByWarehouse);

export default router;
