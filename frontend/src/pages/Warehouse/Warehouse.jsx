import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Warehouse.css';
import AddWarehouse from './add_warehouse';

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/warehouses/');
      const formatted = res.data.map((w) => {
        const percentFull = w.capacity > 0 ? Math.round((w.items / w.capacity) * 100) : 0;
        return {
          id: w._id, // full ID for backend operations
          displayId: w._id.slice(-4).toUpperCase(), // short ID for display
          address: `${w.location.address}, ${w.location.city}, ${w.location.state}`,
          manager: w.contact?.name || 'N/A',
          items: w.items,
          capacity: {
            current: w.items,
            total: w.capacity
          },
          percentFull
        };
      });
      setWarehouses(formatted);
    } catch (err) {
      console.error('Failed to fetch warehouses:', err);
    }
  };

  const getProgressBarColor = (percentage) => {
    if (percentage < 70) return 'progress-bar-green';
    return 'progress-bar-yellow';
  };

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.displayId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteWarehouse = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/warehouses/${id}`);
      setWarehouses(prev => prev.filter((wh) => wh.id !== id));
    } catch (err) {
      console.error('Failed to delete warehouse:', err);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Warehouse Management</h1>
        <button className="add-button" onClick={() => setShowForm(true)}>
          <span>+</span> Add Warehouse
        </button>
      </div>

      <div className="search-container">
        <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
        </svg>
        <input
          type="text"
          placeholder="Search warehouses..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <AddWarehouse
          onAdd={async () => {
            await fetchWarehouses();
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="warehouse-grid">
        {filteredWarehouses.map((warehouse) => (
          <div key={warehouse.id} className="warehouse-card">
            <div className="warehouse-header">
              <div>
                <h2>Warehouse {warehouse.displayId}</h2>
                <div className="location">
                  <svg className="location-icon" width="14" height="14" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>{warehouse.address}</span>
                </div>
              </div>
              <div className="percent-full">
                <span>{warehouse.percentFull}% Full</span>
              </div>
            </div>

            <div className="info-row">
              <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="info-label">Manager:</span>
              <span className="info-value">{warehouse.manager}</span>
            </div>

            <div className="info-row">
              <svg className="info-icon" width="14" height="14" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" strokeWidth="2" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="info-label">Items:</span>
              <span className="info-value">{warehouse.items}</span>
            </div>

            <div className="capacity-container">
              <div className="capacity-header">
                <span className="info-label">Capacity:</span>
                <span className="info-value">
                  {warehouse.capacity.current} / {warehouse.capacity.total} units
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className={`progress-bar ${getProgressBarColor(warehouse.percentFull)}`}
                  style={{ width: `${warehouse.percentFull}%` }}
                ></div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-button">View Details</button>
              <button className="action-button">Manage Stock</button>
              <button
                className="action-button delete-button"
                onClick={() => handleDeleteWarehouse(warehouse.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehouseManagement;
