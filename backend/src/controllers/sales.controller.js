// controllers/sales.controller.js
import asyncHandler from "../utils/asyncHandler.js";
import { SalesOrder } from "../models/salesOrder.model.js";
import { Item } from "../models/item.model.js"; // ✅ This line fixes the error
import { Order } from "../models/order.model.js";
// Add this new controller function
export const getSalesActivity = async (req, res) => {
  try {
    // Example implementation - replace with your actual database queries
    const salesActivity = {
      toBePacked: await Order.countDocuments({ status: 'packing' }),
      toBeShipped: await Order.countDocuments({ status: 'ready_to_ship' }),
      toBeDelivered: await Order.countDocuments({ status: 'shipped' }),
      toBeInvoiced: await Order.countDocuments({ status: 'pending_invoice' })
    };

    res.status(200).json({
      success: true,
      data: salesActivity
    });
  } catch (error) {
    console.error('Error fetching sales activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales activity data'
    });
  }
};
export const getSalesSummary = asyncHandler(async (req, res) => {
  const summary = await SalesOrder.aggregate([
    {
      $group: {
        _id: { channel: "$channel", status: "$status" },
        count: { $sum: 1 }
      }
    }
  ]);

  // Organize results
  const result = {};
  summary.forEach(entry => {
    const { channel, status } = entry._id;
    if (!result[channel]) {
      result[channel] = {
        Draft: 0,
        Confirmed: 0,
        Packed: 0,
        Shipped: 0,
        Invoiced: 0,
      };
    }
    result[channel][status] = entry.count;
  });

  res.status(200).json(result);
});

// 🛒 Create a new Sales Order
export const createSalesOrder = asyncHandler(async (req, res) => {
    const { channel, status, items, customer } = req.body;
  
    if (!channel || !status || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "All fields (channel, status, items) are required." });
    }
  
    // 🔢 Calculate total amount from item prices
    let totalAmount = 0;
    for (const itemEntry of items) {
      const itemDoc = await Item.findById(itemEntry.item);
      if (!itemDoc) throw new Error(`Item not found: ${itemEntry.item}`);
      totalAmount += itemDoc.price * itemEntry.quantity;
    }
  
    // ✅ Create the sales order
    const order = await SalesOrder.create({
      channel,
      status,
      items,
      totalAmount,
      customer
    });
  
    res.status(201).json({ message: "Sales order created", order });
  });