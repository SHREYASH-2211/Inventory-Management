"use client"
// import Navbar from "../Navbar/Navbar"
import { useState } from "react"
import {
  Search, Bell, Settings, User, Grid,
  ChevronDown, Plus, RefreshCw, Box, Truck, FileIcon as FileInvoice, BarChart,
  TrendingUp, DollarSign, Smartphone, ShoppingBag, Layers, AlertTriangle
} from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import "./Home.css"

export default function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard")

  const salesData = [
    { name: 'Week 1', sales: 20000000 },
    { name: 'Week 2', sales: 25000000 },
    { name: 'Week 3', sales: 30000000 },
    { name: 'Week 4', sales: 35880000 },
  ]

  return (
    <div className="inventory-app">
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="refresh-btn"><RefreshCw size={18} /></button>
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search in Customers ( / )" className="search-input" />
            </div>
            <div className="org-info">This is a <span className="test-label">Test</span> organization.</div>
          </div>
          <div className="header-right">
            <div className="demo-org">Demo Org <ChevronDown size={16} /></div>
            {[Plus, User, Bell, Settings, Grid].map((Icon, i) => (
              <button key={i} className="icon-btn"><Icon size={20} /></button>
            ))}
            <div className="user-avatar">
              <img src="/placeholder.svg?height=32&width=32" alt="User" />
            </div>
          </div>
        </header>

        {/* Welcome */}
        <div className="welcome-section">
          <div className="welcome-left">
            <div className="user-icon"><User size={24} /></div>
            <div className="welcome-text">
              <h2>Hello, Demo User</h2>
              <p>Demo Org</p>
            </div>
          </div>
          <div className="helpline">
            <div>Zoho Inventory India Helpline: <strong>18003093036</strong></div>
            <div className="helpline-hours">Mon - Fri • 9:00 AM - 7:00 PM • Toll Free</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["Dashboard", "Getting Started", "Announcements", "Recent Updates"].map(tab => (
            <div key={tab} className={`tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
              {tab}
            </div>
          ))}
        </div>

        {/* Dashboard */}
        <div className="dashboard-content">
          {/* Sales Activity */}
          <div className="card sales-activity">
            <h3 className="card-title"><TrendingUp size={18} className="mr-2" /> Sales Activity</h3>
            <div className="metrics-container">
              {[{ label: "TO BE PACKED", value: 51, unit: "Qty", color: "blue", icon: Box },
              { label: "TO BE SHIPPED", value: 40, unit: "Pkgs", color: "red", icon: Box },
              { label: "TO BE DELIVERED", value: 52, unit: "Pkgs", color: "green", icon: Truck },
              { label: "TO BE INVOICED", value: 97, unit: "Qty", color: "orange", icon: FileInvoice }
              ].map((item, idx) => (
                <div className="metric" key={idx}>
                  <div className={`metric-value ${item.color}`}>{item.value}</div>
                  <div className="metric-label">{item.unit}</div>
                  <div className="metric-status">
                    <div className={`status-icon ${item.color}`}><item.icon size={16} /></div>
                    <div className="status-text">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Summary */}
          <div className="card inventory-summary">
            <h3 className="card-title"><Layers size={18} className="mr-2" /> Inventory Summary</h3>
            <div className="summary-metrics">
              {[{ label: "QUANTITY IN HAND", value: 12746 }, { label: "QUANTITY TO BE RECEIVED", value: 62 }].map((s, i) => (
                <div className="summary-metric" key={i}>
                  <div className="summary-label">{s.label}</div>
                  <div className="summary-value">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="card product-details">
            <h3 className="card-title"><ShoppingBag size={18} className="mr-2" /> Product Details</h3>
            <div className="product-metrics">
              <div className="product-metric">
                <AlertTriangle size={20} className="text-red-500 mb-2" />
                <div className="product-metric-label red">Low Stock Items</div>
                <div className="product-metric-value red">22</div>
              </div>
              <div className="product-chart">
                <div className="chart-title">Active Items</div>
                <div className="pie-chart-placeholder">
                  <div className="pie-chart" style={{ background: "conic-gradient(#10b981 0% 70%, #f1f5f9 70% 100%)" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="card top-selling">
            <div className="top-selling-header">
              <h3 className="card-title"><BarChart size={18} className="mr-2" /> Top Selling Items</h3>
              <div className="time-filter">This Month <ChevronDown size={16} /></div>
            </div>
            <div className="item-grid">
              {[1, 2, 3].map(i => (
                <div className="item-card" key={i}>
                  <div className="item-image">
                    <img src="/placeholder.svg?height=80&width=80" alt="Product" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Order Summary (Updated with Graph) */}
          <div className="card sales-summary">
            <div className="sales-summary-header">
              <h3 className="card-title"><DollarSign size={18} className="mr-2" /> Sales Order Summary (in INR)</h3>
              <div className="time-filter">This Month <ChevronDown size={16} /></div>
            </div>
            <div className="sales-chart-container" style={{ display: "flex", gap: "1rem" }}>
              {/* Graph Section */}
              <div className="sales-chart" style={{ width: "70%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Total Sales */}
              <div className="sales-total" style={{ flex: 1, background: "#e9f2ff", padding: "1rem", borderRadius: "8px" }}>
                <div className="total-sales-label" style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Total Sales</div>
                <div className="sales-type" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div className="sales-dot" style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#3b82f6" }}></div>
                  <div>DIRECT SALES</div>
                </div>
                <div className="sales-amount" style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3b82f6" }}>Rs.110,880,000</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="dashboard-footer">
            <div className="footer-section">
              <h4>OTHER ZOHO APPS</h4>
              <ul>
                <li>Zoho CRM</li>
                <li>Zoho Books</li>
                <li>Zoho Mail</li>
                <li>Zoho Projects</li>
                <li>Zoho People</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>HELP & SUPPORT</h4>
              <ul>
                <li>Contact Support</li>
                <li>FAQs</li>
                <li>User Guides</li>
                <li>Community Forums</li>
                <li>Submit a Ticket</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>QUICK LINKS</h4>
              <ul>
                <li>Dashboard</li>
                <li>Inventory Management</li>
                <li>Sales Orders</li>
                <li>Invoices</li>
                <li>Reports</li>
              </ul>
            </div>
            <div className="footer-branding">
              <p>&copy; 2025 Caffeine Coder Inc. All rights reserved.</p>
              <p>Made with ❤️ for better inventory management.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
