import React, { useState } from "react";
import "./Reports.css";

const ReportDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [helpMode, setHelpMode] = useState(false); // New state for Help mode

  const sections = [
    {
      title: "Sales",
      icon: "🛒",
      items: [
        { name: "Sales by Customer", link: "/reports/sales-by-customer" },
        { name: "Sales by Item", link: "/reports/sales-by-item" },
        { name: "Order Fulfillment By Item", link: "/reports/order-fulfillment" },
        { name: "Sales Return History", link: "/reports/sales-return-history" },
        { name: "Sales by Sales Person", link: "/reports/sales-by-person" },
        { name: "Packing History", link: "/reports/packing-history" },
      ],
    },
    {
      title: "Inventory",
      icon: "📦",
      items: [
        { name: "Inventory Summary", link: "/reports/inventory-summary" },
        { name: "Committed Stock Details", link: "/reports/committed-stock" },
        { name: "Inventory Valuation Summary", link: "/reports/inventory-valuation" },
        { name: "FIFO Cost Lot Tracking", link: "/reports/fifo-cost-tracking" },
        { name: "Inventory Aging Summary", link: "/reports/inventory-aging" },
        { name: "Product Sales Report", link: "/reports/product-sales" },
        { name: "Active Purchase Orders Report", link: "/reports/active-purchase-orders" },
        { name: "Stock Summary Report", link: "/reports/stock-summary" },
      ],
    },
    {
      title: "Receivables",
      icon: "📋",
      items: [
        { name: "Customer Balances", link: "/reports/customer-balances" },
        { name: "Invoice Details", link: "/reports/invoice-details" },
        { name: "Retainer Invoice Details", link: "/reports/retainer-invoice" },
        { name: "Sales Order Details", link: "/reports/sales-order-details" },
        { name: "Delivery Challan Details", link: "/reports/delivery-challan" },
        { name: "Receivable Summary", link: "/reports/receivable-summary" },
        { name: "Receivable Details", link: "/reports/receivable-details" },
      ],
    },
  ];

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filteredSections = sections
    .map((section) => {
      const filteredItems = section.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...section, items: filteredItems };
    })
    .filter((section) => section.items.length > 0);

  const handleHelpButtonClick = () => {
    setHelpMode(!helpMode); // Toggle the help mode on button click
  };

  return (
    <div className={`report-page ${helpMode ? "help-mode" : ""}`}>
      {/* Header with Search */}
      <div className="report-header-flex">
        <h1 className={`report-title ${helpMode ? "highlight-title" : ""}`}>Reports</h1>
        <input
          type="text"
          placeholder="🔍 Search report titles..."
          className={`report-input search-animated ${helpMode ? "highlight-input" : ""}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Help guide display */}
      {helpMode && (
        <div className="help-guide">
          <h3>How to Use the Report Dashboard:</h3>
          <p>
            1. <strong>Report Titles</strong> are listed below. Click on them to view the specific report.
          </p>
          <p>
            2. Use the <strong>Search Bar</strong> above to filter and find your desired report.
          </p>
        </div>
      )}

      {/* Report Cards */}
      <div className="report-sections">
        {filteredSections.map((section) => (
          <div key={section.title} className="report-card">
            <h2 className="section-title">
              <span>{section.icon}</span> {section.title}
            </h2>
            <ul className="section-list">
              {section.items.map((item) => (
                <li key={item.name}>
                  <a href={item.link}>
                    {highlightMatch(item.name, searchTerm)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer Date */}
      <div className="report-footer">19 April 2025</div>

      {/* Help Button */}
      <button className="help-button" onClick={handleHelpButtonClick}>
        ❓ Help
      </button>
    </div>
  );
};

export default ReportDashboard;