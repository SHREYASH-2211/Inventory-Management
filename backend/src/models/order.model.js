// models/order.model.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['packing', 'ready_to_ship', 'shipped', 'delivered', 'pending_invoice'],
    required: true
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  }
});

export const Order = mongoose.model('Order', orderSchema);