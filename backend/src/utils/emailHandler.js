import { sendLowStockAlert } from './sendEmail.js';
import { Warehouse } from '../models/warehouse.model.js';
export const handleLowStockAlert = async (item, warehouse) => {
  try {
    // Validate inputs
    if (!item || !warehouse) {
      console.error("❌ Missing required data for email alert");
      return false;
    }

    // Validate email
    if (!warehouse.contact?.email) {
    //  console.warn(❌ No contact email found for warehouse: ${warehouse.name});
      return false;
    }

    // Send email with retry logic
    let attempts = 3;
    while (attempts > 0) {
      try {
        await sendLowStockAlert(
          warehouse.contact.email,
          item.name,
          warehouse.name,
          item.quantity
        );
        console.log("📬 Low stock alert sent to:", warehouse.contact.email);
        return true;
      } catch (error) {
        attempts--;
        if (attempts === 0) {
          throw error;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error("❌ Failed to send low stock alert:", error.message);
    return false;
  }
};