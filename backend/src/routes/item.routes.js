import express from "express";

import {
  createItem,
  getItems,
  updateItem,
  deleteItem,
    addItemToWarehouse,
} from "../controllers/item.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { requireRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", /* requireRole("admin", "manager"), */ createItem);
router.put("/:id", /* requireRole("admin", "manager"), */ updateItem);
router.delete("/:id", /* requireRole("admin"), */ deleteItem);
router.post("/add-to-warehouse", verifyJWT, addItemToWarehouse);


export default router;
