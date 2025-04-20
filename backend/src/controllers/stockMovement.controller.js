import asyncHandler from "../utils/asyncHandler.js";
import { StockMovement } from "../models/stockMovement.model.js";
import { Item } from "../models/item.model.js";
import { Warehouse } from "../models/warehouse.model.js";

// ✅ Log New Stock Movement

export const logMovement = asyncHandler(async (req, res) => {
    const { item, type, quantity, fromWarehouse, toWarehouse, performedBy } = req.body;
  
    const itemDoc = await Item.findById(item);
    if (!itemDoc) throw new Error("Item not found");
  
    // Convert warehouse names to IDs if provided
    let fromWarehouseId = null;
    let toWarehouseId = null;
  
    if (fromWarehouse) {
      const from = await Warehouse.findOne({ name: fromWarehouse.trim() });
      if (!from) throw new Error("From warehouse name is invalid");
      fromWarehouseId = from._id;
    }
  
    if (toWarehouse) {
      const to = await Warehouse.findOne({ name: toWarehouse.trim() });
      if (!to) throw new Error("To warehouse name is invalid");
      toWarehouseId = to._id;
    }
  
    // Create the stock movement
    const movement = await StockMovement.create({
      item,
      type,
      quantity,
      fromWarehouse: fromWarehouseId,
      toWarehouse: toWarehouseId,
      performedBy
    });
  
    // Update quantity
    if (type === "purchase") itemDoc.quantity += quantity;
    else if (type === "sale") itemDoc.quantity -= quantity;
    else if (type === "transfer") {
      itemDoc.quantity -= 0; // Optional: If you're not changing total quantity
    }
  
    await itemDoc.save();
  
    res.status(201).json({
      message: "Stock movement logged successfully",
      movement
    });
  });


// ✅ Get All Movements with Populated Info
export const getMovements = asyncHandler(async (req, res) => {
  const movements = await StockMovement.find({ item: { $ne: null } })  // Filter out nulls
    .populate("item", "name sku")
    .populate("fromWarehouse", "name")
    .populate("toWarehouse", "name")
    .populate("performedBy", "fullname email")
    .sort({ createdAt: -1 });

  res.status(200).json(movements);
});


// ✅ Reverse Movement
export const reverseMovement = asyncHandler(async (req, res) => {
  const movement = await StockMovement.findById(req.params.id);
  if (!movement || movement.reversed) throw new Error("Invalid or already reversed transaction");

  const item = await Item.findById(movement.item);
  if (!item) throw new Error("Item not found");

  // Reverse quantity changes
  if (movement.type === "purchase") item.quantity -= movement.quantity;
  else if (movement.type === "sale") item.quantity += movement.quantity;
  else if (movement.type === "transfer") {
    // Optional: add from toWarehouse and remove from fromWarehouse if tracked separately
  }

  await item.save();
  movement.reversed = true;
  await movement.save();

  res.status(200).json({ message: "✅ Transaction reversed", movementId: movement._id });
});
