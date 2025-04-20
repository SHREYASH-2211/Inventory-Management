import asyncHandler from "../utils/asyncHandler.js";
import { Warehouse } from "../models/warehouse.model.js";
import { Item } from "../models/item.model.js";
import { StockMovement } from "../models/stockMovement.model.js";
import mongoose from "mongoose";
import { Parser } from "json2csv"; // ✅ Make sure this is included at the top

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
// 1. 📈 Trends over time
export const getInventoryTrends = asyncHandler(async (req, res) => {
    const trend = await StockMovement.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            type: "$type"
          },
          total: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);
  
    res.status(200).json(trend);
  });
  
  // 2. 🚀 Fast vs Slow Moving Items
  export const getFastSlowMovingItems = asyncHandler(async (req, res) => {
    const result = await StockMovement.aggregate([
      { $match: { type: "sale" } },
      { $group: { _id: "$item", totalSold: { $sum: "$quantity" } } },
      { $sort: { totalSold: -1 } },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "_id",
          as: "item"
        }
      },
      { $unwind: "$item" },
      { $project: { itemName: "$item.name", totalSold: 1 } }
    ]);
  
    const fastMoving = result.slice(0, 5);
    const slowMoving = result.slice(-5);
  
    res.status(200).json({ fastMoving, slowMoving });
  });
  
  // 3. 💰 Inventory Valuation
  export const getInventoryValuation = asyncHandler(async (req, res) => {
    const items = await Item.find({}, "name quantity price");
  
    const totalValue = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  
    res.status(200).json({ totalValue, items });
  });
  
  // 4. 🧾 Export CSV
  export const exportInventoryCSV = asyncHandler(async (req, res) => {
    const items = await Item.find().populate("warehouse", "name");
    const fields = ["name", "sku", "type", "description", "price", "quantity", "lowStockThreshold", "warehouse.name"];
    const parser = new Parser({ fields }); // ✅ Now Parser is defined
    const csv = parser.parse(items);
  
    res.header("Content-Type", "text/csv");
    res.attachment("inventory_report.csv");
    return res.send(csv);
  });
  