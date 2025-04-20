// // routes/sales.routes.js
// import express from "express";
// import { getSalesSummary } from "../controllers/sales.controller.js";
// import { requireAuth, authorizeRoles } from "../middlewares/authMiddleware.js";
// import { createSalesOrder } from "../controllers/sales.controller.js";
// const router = express.Router();


// router.get("/summary", requireAuth, authorizeRoles("admin", "manager"), getSalesSummary);
// router.post("/", requireAuth, authorizeRoles("admin", "manager", "staff"), createSalesOrder);

// export default router;
import express from "express";
import { 
  getSalesSummary,
  createSalesOrder,
  getSalesActivity // Add this new controller
} from "../controllers/sales.controller.js";
import { requireAuth, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Existing routes
router.get("/summary", requireAuth, authorizeRoles("admin", "manager"), getSalesSummary);
router.post("/", requireAuth, authorizeRoles("admin", "manager", "staff"), createSalesOrder);

// New route for dashboard sales activity
router.get("/activity", requireAuth, authorizeRoles("admin", "manager", "staff"), getSalesActivity);

export default router;
