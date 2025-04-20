import asyncHandler from '../utils/asyncHandler.js';
import { Item } from '../models/item.model.js';
import { Warehouse } from '../models/warehouse.model.js';
import { sendLowStockAlert } from "../utils/sendEmail.js";
import fs from "fs";
import csvParser from "csv-parser";
export const importItemsFromCSV = asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
  
    const filePath = req.file.path;
    const importedItems = [];
  
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        try {
          const item = {
            name: row.name?.trim(),
            sku: row.sku?.trim(),
            type: row.type?.trim() || "Goods",
            description: row.description?.trim(),
            price: parseFloat(row.price),
            quantity: parseInt(row.quantity),
            lowStockThreshold: parseInt(row.lowStockThreshold),
            warehouse: row.warehouse?.trim()
          };
  
          // Skip invalid rows
          if (
            !item.name ||
            !item.sku ||
            isNaN(item.price) ||
            isNaN(item.quantity) ||
            isNaN(item.lowStockThreshold) ||
            !item.warehouse
          ) {
            console.warn("⚠️ Skipping invalid row:", row);
          } else {
            importedItems.push(item);
          }
        } catch (err) {
          console.error("Error parsing row:", row, err);
        }
      })
      .on("end", async () => {
        try {
          if (importedItems.length === 0) {
            return res.status(400).json({ message: "❌ No valid items to import" });
          }
  
          const inserted = await Item.insertMany(importedItems);
          fs.unlinkSync(filePath);
  
          res.status(200).json({
            message: "✅ Items imported successfully",
            importedCount: inserted.length,
            data: inserted,
          });
        } catch (error) {
          console.error("❌ Import error:", error);
          res.status(500).json({
            message: "❌ Import failed",
            error: error.message,
          });
        }
      });
  });
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

    //search item by name
export const searchItemByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: "Name query parameter is required" });
  }

  const items = await Item.find({ name: { $regex: name, $options: "i" } }).populate("warehouse");
  if (items.length === 0) {
    return res.status(404).json({ message: "No items found" });
  }

  res.status(200).json(items);
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
