import asyncHandler from '../utils/asyncHandler.js';
import { Warehouse } from "../models/warehouse.model.js";
import { Item } from "../models/item.model.js";
import mongoose from "mongoose";

// CREATE
export const createWarehouse = asyncHandler(async (req, res) => {
  const { name, location, contact, capacity, status, createdBy } = req.body;
  const warehouse = await Warehouse.create({ name, location, contact, capacity, status, createdBy });
  res.status(201).json(warehouse);
});

// GET ALL
export const getWarehouses = asyncHandler(async (req, res) => {
  const warehouses = await Warehouse.find().populate("createdBy", "fullname email");
  res.status(200).json(warehouses);
});

// GET SINGLE
export const getWarehouseById = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findById(req.params.id).populate("createdBy", "fullname email");
  if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
  res.status(200).json(warehouse);
});

// UPDATE
export const updateWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!warehouse) return res.status(404).json({ message: "Warehouse not found" });
  res.status(200).json(warehouse);
});

// DELETE
export const deleteWarehouse = asyncHandler(async (req, res) => {
  const deleted = await Warehouse.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Warehouse not found" });
  res.status(204).send();
});

// TOTAL QUANTITY FROM WAREHOUSE BY NAME
export const getTotalQuantityByWarehouse = asyncHandler(async (req, res) => {
    const { name } = req.params;
  
    if (!name) {
      return res.status(400).json({ message: "Warehouse name is required" });
    }
  
    const warehouse = await Warehouse.findOne({ name });
  
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }
  
    const total = await Item.aggregate([
      { $match: { warehouse: warehouse._id } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
    ]);
  
    const totalQuantity = total[0]?.totalQuantity || 0;
  
    res.status(200).json({
      warehouseName: warehouse.name,
      totalQuantity,
    });
  });