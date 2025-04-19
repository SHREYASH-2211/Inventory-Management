import nodemailer from "nodemailer";

export const sendLowStockAlert = async (toEmail, itemName, warehouseName, currentQty) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use your provider
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Inventory Alert" <${process.env.SMTP_EMAIL}>`,
    to: toEmail,
    subject: `🚨 Low Stock Alert: ${itemName}`,
    html: `
      <p>Hi,</p>
      <p><strong>${itemName}</strong> in <strong>${warehouseName}</strong> has fallen below its threshold.</p>
      <p>Current stock: <strong>${currentQty}</strong></p>
      <p>Please reorder to avoid stockout.</p>
      <hr />
      <small>This is an automated alert from your inventory system.</small>
    `,
  };

  await transporter.sendMail(mailOptions);
};
