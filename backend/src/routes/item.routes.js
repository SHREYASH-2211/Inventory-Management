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
import multer from "multer";
import { importItemsFromCSV } from "../controllers/item.controller.js";

const upload = multer({ dest: "uploads/" });


const router = express.Router();

// router.get("/", getItems);
// router.post("/", /* requireRole("admin", "manager"), */ createItem);
// router.put("/:id", /* requireRole("admin", "manager"), */ updateItem);
// router.delete("/:id", /* requireRole("admin"), */ deleteItem);
// router.post("/add-to-warehouse", verifyJWT, addItemToWarehouse);
// router.get("/search/:name", verifyJWT, getItems); // Search items by name
// router.post("/import", upload.single("file"), importItemsFromCSV);


import { requireAuth, authorizeRoles } from "../middlewares/authMiddleware.js";

router.get("/", requireAuth, getItems);
router.post("/", requireAuth, authorizeRoles("admin", "manager"), createItem);
router.put("/:id", requireAuth, authorizeRoles("admin", "manager"), updateItem);
router.delete("/:id", requireAuth, authorizeRoles("admin"), deleteItem);
router.post("/add-to-warehouse", requireAuth, addItemToWarehouse);
router.get("/search/:name", requireAuth, getItems); // Search items by name
router.post("/import", upload.single("file"), importItemsFromCSV);
export default router;
