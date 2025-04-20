import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema({
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    type: {
      type: String,
      enum: ["purchase", "sale", "transfer"],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse"
    },
    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse"
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reversed: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });
  
export const StockMovement = mongoose.model("StockMovement", stockMovementSchema);
