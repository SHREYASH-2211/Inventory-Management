import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ["Purchase", "Sale", "Internal Transfer"],
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reversed: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

export const StockMovement = mongoose.model("StockMovement", stockMovementSchema);
