import { Link, useLocation } from "react-router-dom"
import {
  Home, Package, ShoppingCart, CreditCard, Link2, BarChart2,
  FileText, ChevronRight
} from "lucide-react"
import "./Navbar.css"

export default function Navbar() {
  const location = useLocation()

  const navItems = [
    { label: "Home", icon: <Home />, path: "/" },
    { label: "Inventory", icon: <Package />, hasArrow: true, path: "/inventory" },
    { label: "Sales", icon: <ShoppingCart />, hasArrow: true, path: "/sales" },
    { label: "Purchases", icon: <CreditCard />, hasArrow: true, path: "/purchases" },
    { label: "Integrations", icon: <Link2 />, path: "/integrations" },
    { label: "Reports", icon: <BarChart2 />, path: "/reports" },
    { label: "Documents", icon: <FileText />, path: "/documents" },
  ]

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Package className="sidebar-logo-icon" />
        <h2>Inventory</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link to={item.path} key={item.label} className={`nav-item ${location.pathname === item.path ? "active" : ""}`}>
            <div className="nav-icon">{item.icon}</div>
            <span>{item.label}</span>
            {item.hasArrow && <ChevronRight className="nav-chevron" />}
          </Link>
        ))}
      </nav>
    </div>
  )
}
