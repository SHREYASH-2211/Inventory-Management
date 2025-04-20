import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  ArrowLeft,
  Calendar,
  Truck,
  ChevronDown,
  MoreVertical,
  HelpCircle,
  Filter,
  Package,
  ArrowRight,
  Warehouse,
  User,
} from "lucide-react";
import "./Stock.css";

// Mock data - replace with actual API calls
const mockItems = [
  { _id: "1", name: "Laptop", sku: "LP-001" },
  { _id: "2", name: "Monitor", sku: "MN-002" },
  { _id: "3", name: "Keyboard", sku: "KB-003" },
];

const mockWarehouses = [
  { _id: "W1", name: "Main Warehouse" },
  { _id: "W2", name: "East Branch" },
  { _id: "W3", name: "West Branch" },
];

const mockUsers = [
  { _id: "U1", name: "John Smith" },
  { _id: "U2", name: "Sarah Johnson" },
];

const mockMovements = [
  {
    _id: "M1",
    item: mockItems[0],
    type: "purchase",
    quantity: 10,
    fromWarehouse: null,
    toWarehouse: mockWarehouses[0],
    performedBy: mockUsers[0],
    reversed: false,
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    _id: "M2",
    item: mockItems[1],
    type: "transfer",
    quantity: 5,
    fromWarehouse: mockWarehouses[0],
    toWarehouse: mockWarehouses[1],
    performedBy: mockUsers[1],
    reversed: false,
    createdAt: "2023-05-16T14:45:00Z",
  },
];

const StockMovementApp = () => {
  const [currentView, setCurrentView] = useState("list");
  const [movements, setMovements] = useState(mockMovements);
  const [formData, setFormData] = useState({
    item: "",
    type: "purchase",
    quantity: 1,
    fromWarehouse: "",
    toWarehouse: "",
    performedBy: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMovement = {
      _id: `M${movements.length + 1}`,
      item: mockItems.find((i) => i._id === formData.item),
      type: formData.type,
      quantity: formData.quantity,
      fromWarehouse: formData.fromWarehouse
        ? mockWarehouses.find((w) => w._id === formData.fromWarehouse)
        : null,
      toWarehouse: formData.toWarehouse
        ? mockWarehouses.find((w) => w._id === formData.toWarehouse)
        : null,
      performedBy: mockUsers.find((u) => u._id === formData.performedBy),
      reversed: false,
      createdAt: new Date().toISOString(),
    };

    setMovements((prev) => [...prev, newMovement]);
    setCurrentView("list");
  };

  const handleReverse = (movementId) => {
    setMovements((prev) =>
      prev.map((m) => (m._id === movementId ? { ...m, reversed: true } : m))
    );
  };

  return (
    <div className="stock-movement-app">
      {currentView === "list" && (
        <MovementListView
          movements={movements}
          onAddNew={() => setCurrentView("new")}
          onReverse={handleReverse}
        />
      )}

      {currentView === "new" && (
        <NewMovementForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setCurrentView("list")}
          items={mockItems}
          warehouses={mockWarehouses}
          users={mockUsers}
        />
      )}
    </div>
  );
};

const MovementListView = ({ movements, onAddNew, onReverse }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case "purchase":
        return "type-purchase";
      case "sale":
        return "type-sale";
      case "transfer":
        return "type-transfer";
      default:
        return "";
    }
  };

  return (
    <div className="movement-list">
      <div className="list-header">
        <h1>
          <Package size={24} className="header-icon" />
          Stock Movements
        </h1>
        <button onClick={onAddNew} className="new-button">
          <Plus size={16} /> New Movement
        </button>
      </div>

      <div className="movement-table-container">
        <table className="movement-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>From</th>
              <th>To</th>
              <th>Performed By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement._id}>
                <td>{new Date(movement.createdAt).toLocaleDateString()}</td>
                <td>
                  {movement.item.name} ({movement.item.sku})
                </td>
                <td className={getTypeColor(movement.type)}>
                  {movement.type.toUpperCase()}
                </td>
                <td>{movement.quantity}</td>
                <td>{movement.fromWarehouse?.name || "-"}</td>
                <td>{movement.toWarehouse?.name || "-"}</td>
                <td>{movement.performedBy.name}</td>
                <td>{movement.reversed ? "Reversed" : "Active"}</td>
                <td>
                  {!movement.reversed && (
                    <button
                      onClick={() => onReverse(movement._id)}
                      className="reverse-button"
                    >
                      Reverse
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NewMovementForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  items,
  warehouses,
  users,
}) => {
  const showFromWarehouse = formData.type !== "purchase";
  const showToWarehouse = formData.type !== "sale";

  return (
    <div className="movement-form">
      <div className="form-header">
        <button onClick={onCancel} className="back-button">
          <ArrowLeft size={20} />
        </button>
        <h2>New Stock Movement</h2>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Item</label>
          <select
            name="item"
            value={formData.item}
            onChange={onChange}
            required
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} ({item.sku})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Movement Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={onChange}
            required
          >
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={onChange}
            required
          />
        </div>

        {showFromWarehouse && (
          <div className="form-group">
            <label>From Warehouse</label>
            <select
              name="fromWarehouse"
              value={formData.fromWarehouse}
              onChange={onChange}
              required={formData.type === "transfer"}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {showToWarehouse && (
          <div className="form-group">
            <label>To Warehouse</label>
            <select
              name="toWarehouse"
              value={formData.toWarehouse}
              onChange={onChange}
              required={formData.type !== "sale"}
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Performed By</label>
          <select
            name="performedBy"
            value={formData.performedBy}
            onChange={onChange}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Record Movement
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockMovementApp;