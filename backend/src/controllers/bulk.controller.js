import csvParser from "csv-parser";
import { Item } from "../models/item.model.js";
import { Warehouse } from "../models/warehouse.model.js";
import stream from "stream";

export const importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const buffer = req.file.buffer;
    const results = [];

    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const imported = [];

        for (const entry of results) {
          const warehouse = await Warehouse.findOne({ name: entry.warehouseName });

          if (!warehouse) {
            console.warn(`Warehouse "${entry.warehouseName}" not found. Skipping item "${entry.name}".`);
            continue;
          }

          const item = await Item.findOneAndUpdate(
            { sku: entry.sku },
            {
              name: entry.name,
              sku: entry.sku,
              description: entry.description,
              quantity: parseInt(entry.quantity),
              price: parseFloat(entry.price),
              lowStockThreshold: parseInt(entry.lowStockThreshold),
              warehouse: warehouse._id,
            },
            { upsert: true, new: true }
          );

          imported.push(item);
        }

        res.status(200).json({ message: "CSV imported successfully", importedCount: imported.length });
      });
  } catch (err) {
    console.error("❌ CSV import failed:", err.message);
    res.status(500).json({ error: err.message });
  }
};
