import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronDown, MoreHorizontal, Clock, Plus, List, Grid, 
  HelpCircle, Settings, Bell, User, Menu, ChevronUp, X, Loader, 
  AlertCircle, Check, Trash2, Edit, Warehouse, Package, BarChart2, Tag
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Inventory.css';

const API_BASE_URL = 'http://192.168.252.193:8000/api/v1/items';

const ItemModal = ({ isOpen, onClose, onSubmit, initialData, warehouses }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    warehouse: '',
    quantity: '',
    price: '',
    lowStockThreshold: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        description: initialData.description || '',
        warehouse: initialData.warehouse?._id || '',
        quantity: initialData.quantity || '',
        price: initialData.price || '',
        lowStockThreshold: initialData.lowStockThreshold || ''
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        warehouse: warehouses[0]?._id || '',
        quantity: '',
        price: '',
        lowStockThreshold: ''
      });
    }
  }, [initialData, warehouses]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.warehouse) newErrors.warehouse = 'Warehouse is required';
    if (formData.quantity && isNaN(formData.quantity)) newErrors.quantity = 'Must be a number';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Must be a number';
    if (formData.lowStockThreshold && isNaN(formData.lowStockThreshold)) newErrors.lowStockThreshold = 'Must be a number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        quantity: formData.quantity ? Number(formData.quantity) : 0,
        price: formData.price ? Number(formData.price) : 0,
        lowStockThreshold: formData.lowStockThreshold ? Number(formData.lowStockThreshold) : 0
      };
      
      await onSubmit(submissionData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to save item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h2>{initialData ? 'Edit Item' : 'Add New Item'}</h2>
            <p>{initialData ? 'Update the item details below' : 'Fill in the details to add a new item'}</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <Package size={16} />
                Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Item name"
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <Tag size={16} />
                SKU <span className="required">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`form-input ${errors.sku ? 'error' : ''}`}
                placeholder="Item SKU"
              />
              {errors.sku && <p className="error-message">{errors.sku}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <Warehouse size={16} />
                Warehouse <span className="required">*</span>
              </label>
              <select
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                className={`form-input ${errors.warehouse ? 'error' : ''}`}
              >
                {warehouses.map(warehouse => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.warehouse && <p className="error-message">{errors.warehouse}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <BarChart2 size={16} />
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`form-input ${errors.quantity ? 'error' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.quantity && <p className="error-message">{errors.quantity}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Price (Rs.)
              </label>
              <div className="price-input-container">
                <span className="price-symbol">Rs.</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && <p className="error-message">{errors.price}</p>}
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className={`form-input ${errors.lowStockThreshold ? 'error' : ''}`}
                placeholder="5"
                min="0"
              />
              {errors.lowStockThreshold && <p className="error-message">{errors.lowStockThreshold}</p>}
            </div>
            
            <div className="form-group full-width">
              <label className="form-label">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Item description"
                rows="3"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader size={18} className="spinner" />
              ) : initialData ? (
                'Update Item'
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function InventoryManagement() {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [viewMode, setViewMode] = useState('list');
  const [filterWarehouse, setFilterWarehouse] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsRes, warehousesRes] = await Promise.all([
          axios.get(API_BASE_URL),
          axios.get('http://192.168.252.193:8000/api/v1/warehouses')
        ]);
        setItems(itemsRes.data);
        setWarehouses(warehousesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load inventory data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesWarehouse = filterWarehouse === 'all' || 
                            item.warehouse?._id === filterWarehouse ||
                            item.warehouse?.name === filterWarehouse;
    
    return matchesSearch && matchesWarehouse;
  });

  const sortedItems = React.useMemo(() => {
    if (!sortConfig.key) return filteredItems;
    
    return [...filteredItems].sort((a, b) => {
      const aValue = sortConfig.key.includes('.') 
        ? sortConfig.key.split('.').reduce((o, i) => o?.[i], a)
        : a[sortConfig.key];
      const bValue = sortConfig.key.includes('.') 
        ? sortConfig.key.split('.').reduce((o, i) => o?.[i], b)
        : b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredItems, sortConfig]);

  useEffect(() => {
    if (selectAll) {
      setSelectedItems(sortedItems.map(item => item._id));
    } else if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    }
  }, [selectAll, sortedItems]);

  useEffect(() => {
    if (selectedItems.length === 0 || selectedItems.length < sortedItems.length) {
      setSelectAll(false);
    } else if (selectedItems.length === sortedItems.length) {
      setSelectAll(true);
    }
  }, [selectedItems, sortedItems]);

  const handleItemSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' 
      ? 'descending' 
      : 'ascending';
    setSortConfig({ key, direction });
  };

  const handleOpenNewItemModal = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSubmitItem = async (itemData) => {
    try {
      let response;
      if (currentItem) {
        response = await axios.put(`${API_BASE_URL}/${currentItem._id}`, itemData);
        setItems(items.map(item => 
          item._id === currentItem._id ? response.data : item
        ));
        toast.success('Item updated successfully');
      } else {
        response = await axios.post(API_BASE_URL, itemData);
        setItems([...items, response.data]);
        toast.success('Item added successfully');
      }
      return response.data;
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(error.response?.data?.message || 'Failed to save item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`${API_BASE_URL}/${id}`);
      setItems(items.filter(item => item._id !== id));
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) return;
    
    try {
      setIsDeleting(true);
      await Promise.all(
        selectedItems.map(id => axios.delete(`${API_BASE_URL}/${id}`))
      );
      setItems(items.filter(item => !selectedItems.includes(item._id)));
      setSelectedItems([]);
      toast.success(`${selectedItems.length} items deleted successfully`);
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Failed to delete some items');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('search-input').focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner-container">
            <Loader size={48} className="spinner" />
          </div>
          <h2>Loading Inventory</h2>
          <p>Please wait while we load your items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">
            <AlertCircle size={24} />
          </div>
          <h2>Error Loading Inventory</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <button className="header-icon-button">
              <Clock size={20} />
            </button>
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search size={16} />
                <input 
                  id="search-input"
                  type="text" 
                  placeholder="Search in Items ( / )" 
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="search-shortcut">/</div>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="org-selector">
              <ChevronDown size={16} />
            </div>
            <button className="add-button">
              <Plus size={16} />
            </button>
            <button className="header-icon-button">
              <User size={20} />
            </button>
            <button className="header-icon-button notification-button">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <button className="header-icon-button">
              <Settings size={20} />
            </button>
            <div className="user-avatar">DU</div>
            <button className="header-icon-button">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-container">
          <div className="page-header">
            <div className="page-header-left">
              <h1>Inventory Management</h1>
              
              <div className="warehouse-dropdown">
                <button className="dropdown-button">
                  <span>
                    {filterWarehouse === 'all' ? 'All Warehouses' : 
                     filterWarehouse === 'backup' ? 'Backup Storage' :
                     warehouses.find(w => w._id === filterWarehouse)?.name || filterWarehouse}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    <div 
                      className={`dropdown-item ${filterWarehouse === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterWarehouse('all')}
                    >
                      <span>All Warehouses</span>
                      {filterWarehouse === 'all' && <Check size={16} />}
                    </div>
                    <div 
                      className={`dropdown-item ${filterWarehouse === 'backup' ? 'active' : ''}`}
                      onClick={() => setFilterWarehouse('backup')}
                    >
                      <Warehouse size={14} />
                      <span>Backup Storage</span>
                      {filterWarehouse === 'backup' && <Check size={16} />}
                    </div>
                    {warehouses.map(warehouse => (
                      <div 
                        key={warehouse._id}
                        className={`dropdown-item ${filterWarehouse === warehouse._id ? 'active' : ''}`}
                        onClick={() => setFilterWarehouse(warehouse._id)}
                      >
                        <Warehouse size={14} />
                        <span>{warehouse.name}</span>
                        {filterWarehouse === warehouse._id && <Check size={16} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="selected-count">
                  {selectedItems.length} selected
                </div>
              )}
            </div>
            
            <div className="page-header-right">
              {selectedItems.length > 0 && (
                <button 
                  onClick={handleDeleteSelected}
                  className="delete-selected-button"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader size={16} className="spinner" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  <span>Delete</span>
                </button>
              )}
              
              <button 
                onClick={handleOpenNewItemModal}
                className="new-item-button"
              >
                <Plus size={16} />
                <span>New Item</span>
              </button>
              
              <div className="view-toggle">
                <button 
                  className={`toggle-button ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
                <button 
                  className={`toggle-button ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
              </div>
              
              <div className="more-actions">
                <button className="more-button">
                  <MoreHorizontal size={18} />
                </button>
                <div className="more-menu">
                  <div className="more-menu-content">
                    <div className="more-menu-item">
                      <span>Export Items</span>
                    </div>
                    <div className="more-menu-item">
                      <span>Import Items</span>
                    </div>
                    <div className="more-menu-item">
                      <span>Print List</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="help-button">
                <HelpCircle size={18} />
              </button>
            </div>
          </div>

          {viewMode === 'list' && (
            <div className="table-container">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="checkbox-cell">
                        <input 
                          type="checkbox" 
                          className="row-checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSort('name')}
                      >
                        <div className="header-content">
                          <span>NAME</span>
                          {sortConfig.key === 'name' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} /> : 
                              <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSort('sku')}
                      >
                        <div className="header-content">
                          <span>SKU</span>
                          {sortConfig.key === 'sku' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} /> : 
                              <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSort('warehouse.name')}
                      >
                        <div className="header-content">
                          <span>WAREHOUSE</span>
                          {sortConfig.key === 'warehouse.name' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} /> : 
                              <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSort('quantity')}
                      >
                        <div className="header-content">
                          <span>QTY</span>
                          {sortConfig.key === 'quantity' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} /> : 
                              <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th 
                        className="sortable-header"
                        onClick={() => handleSort('price')}
                      >
                        <div className="header-content">
                          <span>PRICE</span>
                          {sortConfig.key === 'price' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} /> : 
                              <ChevronDown size={14} />
                          )}
                        </div>
                      </th>
                      <th className="description-header">
                        DESCRIPTION
                      </th>
                      <th className="actions-header">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedItems.length > 0 ? (
                      sortedItems.map((item) => (
                        <tr 
                          key={item._id} 
                          className={`table-row ${selectedItems.includes(item._id) ? 'selected' : ''}`}
                        >
                          <td className="checkbox-cell">
                            <input 
                              type="checkbox" 
                              className="row-checkbox"
                              checked={selectedItems.includes(item._id)}
                              onChange={() => handleItemSelect(item._id)}
                            />
                          </td>
                          <td className="name-cell">
                            <div className="name-content">
                              <span className="item-name">{item.name}</span>
                              {item.quantity <= item.lowStockThreshold && (
                                <span className="low-stock-badge">
                                  Low Stock
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="sku-cell">
                            {item.sku}
                          </td>
                          <td className="warehouse-cell">
                            <div className="warehouse-content">
                              <Warehouse size={14} />
                              {item.warehouse?.name || 'Backup Storage'}
                            </div>
                          </td>
                          <td className="quantity-cell">
                            {item.quantity}
                          </td>
                          <td className="price-cell">
                            {item.price ? `Rs.${item.price.toFixed(2)}` : 'N/A'}
                          </td>
                          <td className="description-cell">
                            {item.description || '-'}
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button 
                                onClick={() => handleEditItem(item)}
                                className="action-button edit-button"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item._id)}
                                className="action-button delete-button"
                                disabled={isDeleting}
                              >
                                {isDeleting && selectedItems.includes(item._id) ? (
                                  <Loader size={16} className="spinner" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="empty-table">
                          <div className="empty-content">
                            <Search size={48} className="empty-icon" />
                            <h3>No items found</h3>
                            <p>
                              {searchTerm || filterWarehouse !== 'all' 
                                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                : 'No items available. Add a new item to get started.'}
                            </p>
                            {(searchTerm || filterWarehouse !== 'all') ? (
                              <button
                                onClick={() => {
                                  setSearchTerm('');
                                  setFilterWarehouse('all');
                                }}
                                className="clear-filters-button"
                              >
                                Clear filters
                              </button>
                            ) : (
                              <button
                                onClick={handleOpenNewItemModal}
                                className="add-item-button"
                              >
                                <Plus size={16} />
                                Add New Item
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {viewMode === 'grid' && (
            <div className="grid-container">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => (
                  <div 
                    key={item._id} 
                    className={`grid-item ${selectedItems.includes(item._id) ? 'selected' : ''}`}
                  >
                    <div className="grid-item-content">
                      <div className="grid-item-header">
                        <div className="grid-item-checkbox">
                          <input 
                            type="checkbox" 
                            className="row-checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleItemSelect(item._id)}
                          />
                          <div className="item-icon">
                            <Package size={24} />
                          </div>
                        </div>
                        <div className="grid-item-price">
                          <div className="price-value">
                            {item.price ? `Rs.${item.price.toFixed(2)}` : 'N/A'}
                          </div>
                          <div className={`quantity-badge ${
                            item.quantity <= item.lowStockThreshold 
                              ? 'low' 
                              : 'normal'
                          }`}>
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid-item-body">
                        <h3 className="item-name">
                          {item.name}
                        </h3>
                        <div className="item-sku">
                          <Tag size={14} />
                          <span>{item.sku}</span>
                        </div>
                      </div>
                      
                      <div className="item-warehouse">
                        <Warehouse size={14} />
                        <span>{item.warehouse?.name || 'Backup Storage'}</span>
                      </div>
                      
                      {item.description && (
                        <div className="item-description">
                          {item.description}
                        </div>
                      )}
                      
                      <div className="grid-item-footer">
                        <div className="item-actions">
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="action-button edit-button"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item._id)}
                            className="action-button delete-button"
                            disabled={isDeleting}
                          >
                            {isDeleting && selectedItems.includes(item._id) ? (
                              <Loader size={16} className="spinner" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                        {item.quantity <= item.lowStockThreshold && (
                          <span className="low-stock-badge">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-grid">
                  <div className="empty-content">
                    <Search size={48} className="empty-icon" />
                    <h3>No items found</h3>
                    <p>
                      {searchTerm || filterWarehouse !== 'all' 
                        ? 'Try adjusting your search or filter to find what you\'re looking for.'
                        : 'No items available. Add a new item to get started.'}
                    </p>
                    {(searchTerm || filterWarehouse !== 'all') ? (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setFilterWarehouse('all');
                        }}
                        className="clear-filters-button"
                      >
                        Clear filters
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenNewItemModal}
                        className="add-item-button"
                      >
                        <Plus size={16} />
                        Add New Item
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <ItemModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitItem}
        initialData={currentItem}
        warehouses={warehouses}
      />
    </div>
  );
}