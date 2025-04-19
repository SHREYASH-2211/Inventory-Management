import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, MoreHorizontal, Clock, Plus, List, Grid, HelpCircle, Settings, Bell, User, Menu, ChevronUp, X } from 'lucide-react';

// Modal component extracted for better organization
const AddItemModal = ({ isOpen, onClose, onAdd }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    type: 'Service',
    description: '',
    rate: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!newItem.name.trim()) errors.name = 'Name is required';
    if (!newItem.sku.trim()) errors.sku = 'SKU is required';
    
    // Format rate if provided
    if (newItem.rate.trim() && !newItem.rate.startsWith('Rs.')) {
      setNewItem({
        ...newItem,
        rate: `Rs.${newItem.rate}`
      });
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add new item
  const handleAddItem = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formattedRate = newItem.rate.startsWith('Rs.') ? newItem.rate : `Rs.${newItem.rate}`;
      
      const itemToAdd = {
        name: newItem.name,
        sku: newItem.sku,
        type: newItem.type,
        description: newItem.description,
        rate: formattedRate
      };
      
      onAdd(itemToAdd);
    }
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setNewItem({
        name: '',
        sku: '',
        type: 'Service',
        description: '',
        rate: ''
      });
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl">
        {/* Modal Header with improved styling */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Item</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        
        {/* Form with improved styling */}
        <form onSubmit={handleAddItem} className="p-6">
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleFormChange}
              className={`w-full p-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              placeholder="Item name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              SKU <span className="text-red-500">*</span>
            </label>
            <input 
              type="text"
              name="sku"
              value={newItem.sku}
              onChange={handleFormChange}
              className={`w-full p-3 border ${formErrors.sku ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
              placeholder="Item SKU"
            />
            {formErrors.sku && (
              <p className="text-red-500 text-sm mt-1">{formErrors.sku}</p>
            )}
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Type
            </label>
            <div className="relative">
              <select
                name="type"
                value={newItem.type}
                onChange={handleFormChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-colors duration-200"
              >
                <option value="Service">Service</option>
                <option value="Goods">Goods</option>
              </select>
              <ChevronDown size={20} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea 
              name="description"
              value={newItem.description}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 min-h-32"
              placeholder="Item description"
              rows="4"
            />
          </div>
          
          <div className="mb-6">
  <label className="block text-gray-700 font-medium mb-2">
    Rate
  </label>
  <div className="relative">
    <span className="absolute left-3 top-3.5 text-gray-500 font-medium">Rs.</span>
    <input 
      type="text"
      name="rate"
      value={newItem.rate.startsWith('Rs.') ? newItem.rate.slice(3) : newItem.rate}
      onChange={handleFormChange}
      className="w-full p-3 pl-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      placeholder="0.00"
    />
  </div>
</div>

          
          {/* Action buttons with improved styling */}
          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function InventoryManagement() {
  // Sample data for the table
  const initialItems = [
    { id: 1, name: "Queen Size Bed", sku: "Item 1 sku", type: "Service", description: "Mid-century wooden double ...", rate: "Rs.1448.00" },
    { id: 2, name: "Area Rug", sku: "Item 2 sku", type: "Service", description: "A soft, high-quality area rug t...", rate: "Rs.5356.00" },
    { id: 3, name: "Storage Cabinet", sku: "Item 3 sku", type: "Service", description: "", rate: "" },
    { id: 4, name: "Sofa", sku: "Item 4 sku", type: "Service", description: "", rate: "" },
    { id: 5, name: "Area Rug", sku: "Item 5 sku", type: "Service", description: "A soft, high-quality area rug t...", rate: "Rs.8095.00" },
    { id: 6, name: "Coffee Table", sku: "Item 6 sku", type: "Service", description: "A sleek, modern coffee table ...", rate: "Rs.1210.00" },
    { id: 7, name: "Executive Office Desk", sku: "Item 7 sku", type: "Goods", description: "A spacious executive desk wi...", rate: "Rs.6531.00" },
  ];

  // State management
  const [items, setItems] = useState(initialItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [viewMode, setViewMode] = useState('list');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setItems(initialItems);
    } else {
      const filtered = initialItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setItems(filtered);
    }
  }, [searchTerm]);

  // Handle sort functionality
  useEffect(() => {
    if (sortConfig.key) {
      const sortedItems = [...items].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setItems(sortedItems);
    }
  }, [sortConfig]);

  // Handle select all functionality
  useEffect(() => {
    if (selectAll) {
      setSelectedItems(items.map(item => item.id));
    } else if (selectedItems.length === items.length) {
      setSelectedItems([]);
    }
  }, [selectAll]);

  // Reset select all when selected items change
  useEffect(() => {
    if (selectedItems.length === 0 || selectedItems.length < items.length) {
      setSelectAll(false);
    } else if (selectedItems.length === items.length) {
      setSelectAll(true);
    }
  }, [selectedItems, items]);

  // Filter by type
  useEffect(() => {
    if (filterType === 'all') {
      setItems(initialItems);
    } else {
      const filtered = initialItems.filter(item => item.type === filterType);
      setItems(filtered);
    }
  }, [filterType]);

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
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Add new item from modal
  const handleAddItem = (itemData) => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    const itemToAdd = {
      id: newId,
      ...itemData
    };
    
    // Update items state with new item
    const updatedItems = [...items, itemToAdd];
    setItems(updatedItems);
    
    // Also update initialItems to persist the new item across filters
    initialItems.push(itemToAdd);
    
    // Close modal
    setIsModalOpen(false);
  };

  // Handle delete selected
  const handleDeleteSelected = () => {
    const remainingItems = items.filter(item => !selectedItems.includes(item.id));
    setItems(remainingItems);
    setSelectedItems([]);
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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Clock size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
            <Search size={16} className="text-gray-500 mr-2" />
            <input 
              id="search-input"
              type="text" 
              placeholder="Search in Items ( / )" 
              className="bg-transparent border-none outline-none text-sm w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="text-gray-600">
          This is a <span className="font-semibold">Test</span> organization.
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center cursor-pointer">
            <span>Demo Org</span>
            <ChevronDown size={16} className="ml-1" />
          </div>
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
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
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Page Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">All Items</h1>
            <div className="ml-1 relative group">
              <ChevronDown size={16} className="text-gray-500 cursor-pointer" />
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg rounded-md hidden group-hover:block z-10">
                <div className="p-2">
                  <div className="text-sm font-medium mb-1">Filter by Type</div>
                  <div 
                    className={`px-2 py-1 rounded cursor-pointer ${filterType === 'all' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    onClick={() => setFilterType('all')}
                  >
                    All Types
                  </div>
                  <div 
                    className={`px-2 py-1 rounded cursor-pointer ${filterType === 'Service' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    onClick={() => setFilterType('Service')}
                  >
                    Service
                  </div>
                  <div 
                    className={`px-2 py-1 rounded cursor-pointer ${filterType === 'Goods' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    onClick={() => setFilterType('Goods')}
                  >
                    Goods
                  </div>
                </div>
              </div>
            </div>
            {selectedItems.length > 0 && (
              <div className="ml-4 text-sm text-gray-600">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedItems.length > 0 && (
              <button 
                onClick={handleDeleteSelected}
                className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
              >
                Delete Selected
              </button>
            )}
            <button 
              onClick={handleOpenNewItemModal}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <Plus size={16} className="mr-1" />
              <span>New</span>
            </button>
            <div className="border border-gray-300 rounded-md flex">
              <button 
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} className="text-gray-500" />
              </button>
              <button 
                className={`p-2 border-l border-gray-300 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
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
            <button className="p-2 bg-orange-100 text-orange-500 rounded-full">
              <HelpCircle size={18} />
            </button>
          </div>
        </div>

        {/* Table View */}
        {viewMode === 'list' && (
          <div className="flex-1 px-6 overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-200">
                  <th className="w-12 py-3 px-4 text-left">
                    <input 
                      type="checkbox" 
                      className="rounded" 
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-gray-600 font-semibold text-sm cursor-pointer"
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
                    className="py-3 px-4 text-left text-gray-600 font-semibold text-sm cursor-pointer"
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
                    className="py-3 px-4 text-left text-gray-600 font-semibold text-sm cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      TYPE
                      {sortConfig.key === 'type' && (
                        sortConfig.direction === 'ascending' ? 
                          <ChevronUp size={14} className="ml-1" /> : 
                          <ChevronDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-semibold text-sm">DESCRIPTION</th>
                  <th 
                    className="py-3 px-4 text-left text-gray-600 font-semibold text-sm cursor-pointer"
                    onClick={() => handleSort('rate')}
                  >
                    <div className="flex items-center">
                      RATE
                      {sortConfig.key === 'rate' && (
                        sortConfig.direction === 'ascending' ? 
                          <ChevronUp size={14} className="ml-1" /> : 
                          <ChevronDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="w-12 py-3 px-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-gray-200 hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-4 px-4">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="text-blue-500 hover:underline cursor-pointer">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{item.sku}</td>
                    <td className="py-4 px-4 text-gray-700">{item.type}</td>
                    <td className="py-4 px-4 text-gray-700">{item.description}</td>
                    <td className="py-4 px-4 text-gray-700">{item.rate}</td>
                    <td className="py-4 px-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Search size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="flex-1 px-6 py-4 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className={`border rounded-md p-4 hover:shadow-md transition-shadow ${selectedItems.includes(item.id) ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded mr-2" 
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                      />
                      <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded">
                        <img src="/api/placeholder/40/40" alt="item" className="w-8 h-8 opacity-50" />
                      </div>
                    </div>
                    <div className="text-gray-700 font-medium">{item.rate}</div>
                  </div>
                  <div className="mb-1">
                    <div className="text-blue-500 font-medium hover:underline cursor-pointer">{item.name}</div>
                    <div className="text-gray-600 text-sm">{item.sku}</div>
                  </div>
                  <div className="text-xs text-gray-500">{item.type}</div>
                  {item.description && <div className="mt-2 text-sm text-gray-700">{item.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {items.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Improved Modal Component */}
      <AddItemModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddItem}
      />
    </div>
  );
}