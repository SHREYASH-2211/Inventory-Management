import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  location: {
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  contact: {
    name: String,
    phone: String,
    email: String,
  },
  capacity: Number,
  items: Number,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, {
  timestamps: true,
});

export const Warehouse = mongoose.model("Warehouse", warehouseSchema);
