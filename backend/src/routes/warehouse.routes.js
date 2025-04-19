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

router.get("/", getWarehouses);
router.post("/", /* requireRole("admin", "manager"), */ createWarehouse);
router.put("/:id", /* requireRole("admin", "manager"), */ updateWarehouse);
router.delete("/:id", /* requireRole("admin"), */ deleteWarehouse);
router.get("/total-quantity/:name", getTotalQuantityByWarehouse);

export default router;
