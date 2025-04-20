import React, { useState } from 'react';
import axios from 'axios';
import './AddWareHouse.css'; // Optional: for styling

const AddWarehouse = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    location: {
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    contact: {
      name: '',
      phone: '',
      email: ''
    },
    capacity: 0,
    items: 0,
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === 'items' || name === 'capacity' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://192.168.252.193:8000/api/v1/warehouses/", form);
      alert("Warehouse added successfully!");
      setForm({
        name: '',
        location: {
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: ''
        },
        contact: {
          name: '',
          phone: '',
          email: ''
        },
        capacity: 0,
        items: 0,
        status: 'active'
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to add warehouse.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Warehouse</h2>
      <form onSubmit={handleSubmit}>
        <h3>Basic Info</h3>
        <input name="name" placeholder="Warehouse Name *" value={form.name} onChange={handleChange} required />

        <h3>Location</h3>
        <input name="location.address" placeholder="Address" value={form.location.address} onChange={handleChange} />
        <input name="location.city" placeholder="City" value={form.location.city} onChange={handleChange} />
        <input name="location.state" placeholder="State" value={form.location.state} onChange={handleChange} />
        <input name="location.postalCode" placeholder="Postal Code" value={form.location.postalCode} onChange={handleChange} />
        <input name="location.country" placeholder="Country" value={form.location.country} onChange={handleChange} />

        <h3>Contact</h3>
        <input name="contact.name" placeholder="Manager Name" value={form.contact.name} onChange={handleChange} />
        <input name="contact.phone" placeholder="Phone" value={form.contact.phone} onChange={handleChange} />
        <input name="contact.email" placeholder="Email" value={form.contact.email} onChange={handleChange} />

        <h3>Inventory</h3>
        <input type="number" name="capacity" placeholder="Total Capacity" value={form.capacity} onChange={handleChange} />
        <input type="number" name="items" placeholder="Current Items" value={form.items} onChange={handleChange} />

        <div className="form-footer">
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="form-buttons">
            <button type="submit">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddWarehouse;
