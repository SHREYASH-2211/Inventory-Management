import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronDown, MoreHorizontal, Clock, Plus, List, Grid, 
  HelpCircle, Settings, Bell, User, Menu, ChevronUp, X, Loader, 
  AlertCircle, Check, Trash2, Edit, Warehouse
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1/items';

// Modal component for adding/editing items
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

  // Initialize form with initialData if provided (for editing)
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
    
    // Clear error when user types
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
      // Prepare data for API
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            {initialData ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Item name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            {/* SKU */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.sku ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Item SKU"
              />
              {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
            </div>
            
            {/* Warehouse */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Warehouse <span className="text-red-500">*</span>
              </label>
              <select
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.warehouse ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {warehouses.map(warehouse => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
              {errors.warehouse && <p className="text-red-500 text-sm mt-1">{errors.warehouse}</p>}
            </div>
            
            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="0"
                min="0"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>
            
            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">Rs.</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full p-3 pl-12 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            
            {/* Low Stock Threshold */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className={`w-full p-3 border ${errors.lowStockThreshold ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="5"
                min="0"
              />
              {errors.lowStockThreshold && <p className="text-red-500 text-sm mt-1">{errors.lowStockThreshold}</p>}
            </div>
            
            {/* Description (full width) */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                placeholder="Item description"
                rows="3"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center min-w-24"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader size={20} className="animate-spin" />
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

// Main Inventory Management Component
export default function InventoryManagement() {
  // State management
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

  // Fetch items and warehouses from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsRes, warehousesRes] = await Promise.all([
          axios.get(API_BASE_URL),
          axios.get('http://localhost:8000/api/v1/warehouses')
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

  // Handle search functionality
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesWarehouse = filterWarehouse === 'all' || 
                            item.warehouse?._id === filterWarehouse ||
                            item.warehouse?.name === filterWarehouse;
    
    return matchesSearch && matchesWarehouse;
  });

  // Handle sort functionality
  const sortedItems = React.useMemo(() => {
    if (!sortConfig.key) return filteredItems;
    
    return [...filteredItems].sort((a, b) => {
      // Handle nested properties (like warehouse.name)
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

  // Handle select all functionality
  useEffect(() => {
    if (selectAll) {
      setSelectedItems(sortedItems.map(item => item._id));
    } else if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    }
  }, [selectAll, sortedItems]);

  // Reset select all when selected items change
  useEffect(() => {
    if (selectedItems.length === 0 || selectedItems.length < sortedItems.length) {
      setSelectAll(false);
    } else if (selectedItems.length === sortedItems.length) {
      setSelectAll(true);
    }
  }, [selectedItems, sortedItems]);

  // Handle item selection
  const handleItemSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
  };

  // Handle sorting
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'ascending' 
      ? 'descending' 
      : 'ascending';
    setSortConfig({ key, direction });
  };

  // Open modal for new item
  const handleOpenNewItemModal = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  // Open modal for editing item
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  // Handle form submission (create or update)
  const handleSubmitItem = async (itemData) => {
    try {
      let response;
      if (currentItem) {
        // Update existing item
        response = await axios.put(`${API_BASE_URL}/${currentItem._id}`, itemData);
        setItems(items.map(item => 
          item._id === currentItem._id ? response.data : item
        ));
        toast.success('Item updated successfully');
      } else {
        // Create new item
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

  // Handle delete item
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

  // Handle delete selected items
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

  // Keyboard shortcut for search
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size={48} className="animate-spin text-blue-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Inventory</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Clock size={20} className="text-gray-600" />
              </button>
              <div className="relative">
                <div className="flex items-center bg-gray-100 rounded-md px-3 py-2">
                  <Search size={16} className="text-gray-500 mr-2" />
                  <input 
                    id="search-input"
                    type="text" 
                    placeholder="Search in Items ( / )" 
                    className="bg-transparent border-none outline-none text-sm w-64 placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="text-gray-600 text-sm">
              This is a <span className="font-semibold">Test</span> organization.
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center cursor-pointer text-sm font-medium text-gray-700">
                
                <ChevronDown size={16} className="ml-1" />
              </div>
              <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Plus size={16} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Settings size={20} className="text-gray-600" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Menu size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <h1 className="text-2xl font-semibold text-gray-800">Inventory Management</h1>
              
              <div className="ml-4 relative group">
                <button className="flex items-center text-gray-600 hover:text-gray-800">
                  <span className="mr-1">
                    {filterWarehouse === 'all' ? 'All Warehouses' : 
                     warehouses.find(w => w._id === filterWarehouse)?.name || filterWarehouse}
                  </span>
                  <ChevronDown size={16} />
                </button>
                
                <div className="absolute z-10 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block">
                  <div className="py-1">
                    <div 
                      className={`px-4 py-2 cursor-pointer ${filterWarehouse === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                      onClick={() => setFilterWarehouse('all')}
                    >
                      All Warehouses
                    </div>
                    {warehouses.map(warehouse => (
                      <div 
                        key={warehouse._id}
                        className={`px-4 py-2 cursor-pointer ${filterWarehouse === warehouse._id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                        onClick={() => setFilterWarehouse(warehouse._id)}
                      >
                        {warehouse.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="ml-4 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedItems.length} selected
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedItems.length > 0 && (
                <button 
                  onClick={handleDeleteSelected}
                  className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader size={16} className="animate-spin mr-1" />
                  ) : (
                    <Trash2 size={16} className="mr-1" />
                  )}
                  <span>Delete</span>
                </button>
              )}
              
              <button 
                onClick={handleOpenNewItemModal}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-1" />
                <span>New Item</span>
              </button>
              
              <div className="border border-gray-300 rounded-md flex divide-x divide-gray-300">
                <button 
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} className="text-gray-500" />
                </button>
                <button 
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} className="text-gray-500" />
                </button>
              </div>
              
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 border border-gray-300 rounded-md">
                  <MoreHorizontal size={18} className="text-gray-500" />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block z-10 w-40">
                  <div className="py-1">
                    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">Export Items</div>
                    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">Import Items</div>
                    <div className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">Print List</div>
                  </div>
                </div>
              </div>
              
              <button className="p-2 bg-orange-100 text-orange-500 rounded-full hover:bg-orange-200">
                <HelpCircle size={18} />
              </button>
            </div>
          </div>

          {/* Table View */}
          {viewMode === 'list' && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          NAME
                          {sortConfig.key === 'name' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('sku')}
                      >
                        <div className="flex items-center">
                          SKU
                          {sortConfig.key === 'sku' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('warehouse.name')}
                      >
                        <div className="flex items-center">
                          WAREHOUSE
                          {sortConfig.key === 'warehouse.name' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('quantity')}
                      >
                        <div className="flex items-center">
                          QTY
                          {sortConfig.key === 'quantity' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center">
                          PRICE
                          {sortConfig.key === 'price' && (
                            sortConfig.direction === 'ascending' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DESCRIPTION
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedItems.length > 0 ? (
                      sortedItems.map((item) => (
                        <tr 
                          key={item._id} 
                          className={`hover:bg-gray-50 ${selectedItems.includes(item._id) ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedItems.includes(item._id)}
                              onChange={() => handleItemSelect(item._id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                                {item.name}
                              </span>
                              {item.quantity <= item.lowStockThreshold && (
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                  Low Stock
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {item.sku}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div className="flex items-center">
                              <Warehouse size={14} className="text-gray-400 mr-1" />
                              {item.warehouse?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {item.price ? `Rs.${item.price.toFixed(2)}` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleEditItem(item)}
                                className="text-gray-400 hover:text-blue-600"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item._id)}
                                className="text-gray-400 hover:text-red-600"
                                disabled={isDeleting}
                              >
                                {isDeleting && selectedItems.includes(item._id) ? (
                                  <Loader size={16} className="animate-spin" />
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
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Search size={48} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700 mb-1">No items found</h3>
                            <p className="text-gray-500 max-w-md">
                              {searchTerm || filterWarehouse !== 'all' 
                                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                : 'No items available. Add a new item to get started.'}
                            </p>
                            {(searchTerm || filterWarehouse !== 'all') && (
                              <button
                                onClick={() => {
                                  setSearchTerm('');
                                  setFilterWarehouse('all');
                                }}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                Clear filters
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

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => (
                  <div 
                    key={item._id} 
                    className={`bg-white rounded-lg border ${selectedItems.includes(item._id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleItemSelect(item._id)}
                          />
                          <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                            <Warehouse size={20} className="text-gray-400" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-700 font-medium">
                            {item.price ? `Rs.${item.price.toFixed(2)}` : 'N/A'}
                          </div>
                          <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${
                            item.quantity <= item.lowStockThreshold 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <h3 className="text-blue-600 font-medium hover:underline cursor-pointer">
                          {item.name}
                        </h3>
                        <div className="text-gray-600 text-sm flex items-center mt-1">
                          <span className="truncate">{item.sku}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <Warehouse size={12} className="mr-1" />
                        <span className="truncate">{item.warehouse?.name || 'N/A'}</span>
                      </div>
                      
                      {item.description && (
                        <div className="text-sm text-gray-700 line-clamp-2 mb-4">
                          {item.description}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item._id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            disabled={isDeleting}
                          >
                            {isDeleting && selectedItems.includes(item._id) ? (
                              <Loader size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                        {item.quantity <= item.lowStockThreshold && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search size={48} className="text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No items found</h3>
                    <p className="text-gray-500 max-w-md mb-4">
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Clear filters
                      </button>
                    ) : (
                      <button
                        onClick={handleOpenNewItemModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                      >
                        <Plus size={16} className="mr-1" />
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

      {/* Item Modal */}
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