// models/salesOrder.model.js
import mongoose from "mongoose";

const salesOrderSchema = new mongoose.Schema({
  channel: {
    type: String,
    required: true,
    enum: ["Direct Sales", "Online", "Wholesale"], // Add more if needed
  },
  status: {
    type: String,
    required: true,
    enum: ["Draft", "Confirmed", "Packed", "Shipped", "Invoiced"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  customer: {
    name: String,
    email: String,
  },
});

export const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);
