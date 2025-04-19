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
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  }
,  
  quantity: {
    type: Number,
    //default: 0,
  },
  price: Number,
  
  lowStockThreshold: {
    type: Number,
    //default: 5,
  }
}, {
  timestamps: true,
});

export const Item = mongoose.model("Item", itemSchema);
