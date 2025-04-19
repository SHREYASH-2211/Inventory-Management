import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  quantity: {
    type: Number,
    default: 0,
  },
  price: Number,
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
  }
}, {
  timestamps: true,
});

export const Item = mongoose.model("Item", itemSchema);
