import asyncHandler from "../utils/asyncHandler.js";
import { Warehouse } from "../models/warehouse.model.js";
import { Item } from "../models/item.model.js";
import { StockMovement } from "../models/stockMovement.model.js";
import mongoose from "mongoose";

export const getWarehouseAnalytics = asyncHandler(async (req, res) => {
  const { name } = req.params;

  const warehouse = await Warehouse.findOne({ name });
  if (!warehouse) {
    return res.status(404).json({ message: "Warehouse not found" });
  }

  const warehouseId = warehouse._id;

  // Total Quantity
  const totalQuantityAgg = await Item.aggregate([
    { $match: { warehouse: warehouseId } },
    { $group: { _id: null, total: { $sum: "$quantity" } } }
  ]);

  // Total Inventory Value
  const inventoryValueAgg = await Item.aggregate([
    { $match: { warehouse: warehouseId } },
    { $group: { _id: null, value: { $sum: { $multiply: ["$quantity", "$price"] } } } }
  ]);

  // Low stock items
  const lowStockItems = await Item.find({
    warehouse: warehouseId,
    $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
  }).select("name sku quantity");

  // Total Items
  const totalItems = await Item.countDocuments({ warehouse: warehouseId });

  // Movements Summary
  const movementCounts = await StockMovement.aggregate([
    { $match: { warehouse: warehouseId } },
    { $group: { _id: "$action", count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    warehouseName: warehouse.name,
    totalItems,
    totalQuantity: totalQuantityAgg[0]?.total || 0,
    inventoryValue: inventoryValueAgg[0]?.value || 0,
    lowStockItems,
    movementSummary: movementCounts.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {})
  });
});
