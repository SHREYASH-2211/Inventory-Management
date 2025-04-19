import asyncHandler from '../utils/asyncHandler.js';
import { Item } from '../models/item.model.js';
import { Warehouse } from '../models/warehouse.model.js';
import { sendLowStockAlert } from "../utils/sendEmail.js";


// CREATE
export const createItem = asyncHandler(async (req, res) => {
  console.log("➡️ Creating item with data:", req.body);

  // Create item in DB
  const item = await Item.create(req.body);
  console.log("✅ Item created:", item.name);
  console.log("Quantity:", item.quantity, "| Threshold:", item.lowStockThreshold);

  // Low stock check
  if (item.quantity <= item.lowStockThreshold) {
    console.log("⚠️ Low stock condition met for:", item.name);

    // Get warehouse details
    const warehouse = await Warehouse.findById(item.warehouse);
    if (!warehouse) {
      console.warn("❌ Warehouse not found:", item.warehouse);
    } else if (!warehouse.contact?.email) {
      console.warn("❌ Warehouse has no contact email:", warehouse.name);
    } else {
      try {
        await sendLowStockAlert(
          warehouse.contact.email,
          item.name,
          warehouse.name,
          item.quantity
        );
        console.log("📬 Low stock alert sent to:", warehouse.contact.email);
      } catch (emailError) {
        console.error("❌ Error sending email:", emailError.message);
      }
    }
  } else {
    console.log("ℹ️ Stock is sufficient. No alert needed.");
  }

  console.log("✅ Item creation complete");
  res.status(201).json(item);
});

    

// READ
export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find().populate("warehouse");
   // 👇 Call this AFTER item quantity update
if (items.quantity <= items.lowStockThreshold) {
    const warehouse = await Warehouse.findById(item.warehouse);
  
    if (warehouse && warehouse.contact?.email) {
      await sendLowStockAlert(
        warehouse.contact.email,
        items.name,
        warehouse.name,
        items.quantity
      );
    }
    console.log("Low stock alert sent to:", warehouse.contact.email);
  }
  res.status(200).json(items);
});

// UPDATE
export const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  // 👇 Call this AFTER item quantity update
if (item.quantity <= item.lowStockThreshold) {
    
    const warehouse = await Warehouse.findById(item.warehouse);
  
    if (warehouse && warehouse.contact?.email) {
      await sendLowStockAlert(
        warehouse.contact.email,
        item.name,
        warehouse.name,
        item.quantity
      );
    }
  }
  
  res.status(200).json(item);
});

// DELETE
export const deleteItem = asyncHandler(async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export const addItemToWarehouse = asyncHandler(async (req, res) => {
    const {
      name,
      sku,
      description,
      quantity,
      price,
      warehouseName,
      lowStockThreshold,
    } = req.body;
  
    if (!warehouseName) {
      return res.status(400).json({ message: "Warehouse name is required" });
    }
  
    const warehouse = await Warehouse.findOne({ name: warehouseName });
  
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
  
    const item = await Item.create({
      name,
      sku,
      description,
      quantity,
      price,
      warehouse: warehouse._id,
      lowStockThreshold,
    });
  
    res.status(201).json({
      message: "Item successfully added to warehouse",
      item,
    });
  });
