import asyncHandler from '../utils/asyncHandler.js';
import { StockMovement } from "../models/stockMovement.model.js";

// LOG MOVEMENT
export const logMovement = asyncHandler(async (req, res) => {
  const movement = await StockMovement.create({
    ...req.body,
    performedBy: req.user._id,
  });
  res.status(201).json(movement);
});

// GET HISTORY
export const getMovements = asyncHandler(async (req, res) => {
  const logs = await StockMovement.find().populate("item").sort({ createdAt: -1 });
  res.status(200).json(logs);
});

// REVERSE MOVEMENT
export const reverseMovement = asyncHandler(async (req, res) => {
  const movement = await StockMovement.findByIdAndUpdate(req.params.id, { reversed: true }, { new: true });
  res.status(200).json(movement);
});
