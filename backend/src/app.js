import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app   = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";
import warehouseRouter from "./routes/warehouse.routes.js";
import stockMovementRouter from "./routes/stockMovement.routes.js";
import itemRouter from "./routes/item.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
//Routes declaration
app.use("/api/v1/users", userRouter);
 app.use("/api/v1/warehouses", warehouseRouter);
 app.use("/api/v1/stock-movements", stockMovementRouter);
 app.use("/api/v1/items", itemRouter);
//http://localhost:5000/api/v1/users/register

app.use("/api/v1/analytics", analyticsRoutes);

export default app;