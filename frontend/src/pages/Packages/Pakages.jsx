import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Search, LayoutGrid, List, HelpCircle, AlignJustify, X, Package, Plus } from 'lucide-react';
import './Packages.css';

const mockItems = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Smartphone', price: 699.99 },
  { id: 3, name: 'Headphones', price: 199.99 },
  { id: 4, name: 'Tablet', price: 499.99 },
];

const mockPackages = [
  {
    id: 1,
    name: 'Helga',
    packageId: 'PCK-00',
    orderId: 'SO-00',
    amount: '0.00',
    date: '24 Sep 2024',
    carrier: null,
    status: 'not-shipped',
    channel: 'Direct Sales',
    email: 'helga@example.com',
    items: []
  },
  {
    id: 2,
    name: 'Luigi',
    packageId: 'PCK-01',
    orderId: 'SO-01',
    amount: '0.00',
    date: '26 Jan 2025',
    carrier: null,
    status: 'not-shipped'
  },
  {
    id: 3,
    name: 'Xander',
    packageId: 'PCK-03',
    orderId: 'SO-03',
    amount: '1.00',
    date: '19 Jan 2023',
    carrier: 'FedEx',
    status: 'shipped'
  },
  {
    id: 4,
    name: 'Arielle',
    packageId: 'PCK-02',
    orderId: 'SO-02',
    amount: '0.00',
    date: '2 Aug 2023',
    carrier: 'Australian Post',
    status: 'delivered'
  }
];

const PackageContext = createContext(null);
const usePackages = () => useContext(PackageContext);

const AddPackageModal = ({ onClose }) => {
  const { packages, setPackages } = usePackages();
  const modalRef = useRef(null);
  const [formData, setFormData] = useState({
    channel: 'Direct Sales',
    status: 'Draft',
    customerName: '',
    customerEmail: '',
    items: [{ itemId: '', quantity: 1 }],
    totalAmount: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPackage = {
      id: packages.length + 1,
      name: formData.customerName,
      packageId: `PCK-${String(packages.length + 1).padStart(2, '0')}`,
      orderId: `SO-${String(packages.length + 1).padStart(2, '0')}`,
      amount: formData.totalAmount.toFixed(2),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      carrier: null,
      status: formData.status.toLowerCase(),
      channel: formData.channel,
      email: formData.customerEmail,
      items: formData.items
    };

    setPackages([...packages, newPackage]);
    onClose();
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemId: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    const total = newItems.reduce((sum, item) => {
      const selectedItem = mockItems.find(i => i.id === Number(item.itemId));
      return sum + (selectedItem ? selectedItem.price * item.quantity : 0);
    }, 0);

    setFormData({
      ...formData,
      items: newItems,
      totalAmount: total
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div 
        ref={modalRef}
        className="modal-content"
      >
        <div className="modal-header">
          <h2 className="modal-title">Add New Package</h2>
          <button 
            onClick={onClose}
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Channel *
              </label>
              <select
                required
                value={formData.channel}
                onChange={(e) => setFormData({...formData, channel: e.target.value})}
                className="form-control"
              >
                <option value="Direct Sales">Direct Sales</option>
                <option value="Online">Online</option>
                <option value="Wholesale">Wholesale</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="form-control"
              >
                <option value="Draft">Draft</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Invoiced">Invoiced</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="form-control"
                placeholder="Enter customer name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Customer Email
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                className="form-control"
                placeholder="Enter customer email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex-between mb-2">
              <label className="form-label">
                Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="add-item-btn"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>
            
            <div className="items-list">
              {formData.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-select">
                    <select
                      required
                      value={item.itemId}
                      onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                      className="form-control"
                    >
                      <option value="">Select an item</option>
                      {mockItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - ${item.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="item-quantity">
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="form-control"
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="remove-item-btn"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Total Amount *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.totalAmount}
              onChange={(e) => setFormData({...formData, totalAmount: parseFloat(e.target.value)})}
              className="form-control"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Package
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PackageCard = ({ package: pkg }) => {
  const { viewType } = usePackages();
  
  const listView = (
    <div className="package-card">
      <div className="package-card-header">
        <div className="flex-col">
          <div className="flex items-center mb-1">
            <input 
              type="checkbox" 
              className="package-card-checkbox"
            />
            <h3 className="package-card-title">{pkg.name}</h3>
          </div>
          <div className="package-card-details">
            <span>{pkg.packageId}</span>
            <span>{pkg.orderId}</span>
          </div>
          <div className="package-card-details mt-1">
            {pkg.carrier && <span>{pkg.carrier}</span>}
            <span>{pkg.date}</span>
          </div>
        </div>
        <span className="package-card-amount">${pkg.amount}</span>
      </div>
    </div>
  );
  
  const gridView = (
    <div className="package-card">
      <div className="package-card-header">
        <input 
          type="checkbox" 
          className="package-card-checkbox"
        />
        <div className="flex-col flex-grow">
          <h3 className="package-card-title mb-1">{pkg.name}</h3>
          <div className="package-card-details">
            <span>{pkg.packageId}</span>
            <span>{pkg.orderId}</span>
            {pkg.carrier && <span>{pkg.carrier}</span>}
            <span>{pkg.date}</span>
          </div>
        </div>
        <span className="package-card-amount">${pkg.amount}</span>
      </div>
    </div>
  );
  
  return viewType === 'list' ? listView : gridView;
};

const PackageSection = ({ title, packages, status }) => {
  const { viewType } = usePackages();

  return (
    <div className={`package-section ${status}`}>
      <div className="package-section-header">
        <h2 className="package-section-title">{title}</h2>
        <AlignJustify size={18} className="text-gray-500" />
      </div>
      
      <div className="package-section-content">
        {packages.length === 0 ? (
          <div className="text-center text-gray-500 p-4">No packages found</div>
        ) : (
          packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))
        )}
      </div>
    </div>
  );
};

const Header = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    viewType, 
    toggleViewType, 
    toggleHelpGuide,
    toggleAddPackage 
  } = usePackages();

  return (
    <header className="header">
      <div className="header-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="header-title">All Packages</h1>
          
          <div className="header-controls">
            <div className="search-container">
              <div className="search-icon">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search packages..."
                className="search-input"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleAddPackage}
                className="new-package-btn"
              >
                <Plus size={20} />
                <span>New</span>
              </button>
              
              <div className="view-toggle">
                <button 
                  onClick={() => viewType !== 'list' && toggleViewType()}
                  className={`view-btn ${viewType === 'list' ? 'active' : ''}`}
                  aria-label="List view"
                >
                  <List size={20} />
                </button>
                <button 
                  onClick={() => viewType !== 'grid' && toggleViewType()}
                  className={`view-btn ${viewType === 'grid' ? 'active' : ''}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={20} />
                </button>
              </div>
              
              <button 
                onClick={toggleHelpGuide}
                className="help-btn"
                aria-label="Help"
              >
                <HelpCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const HelpGuide = () => {
  const { toggleHelpGuide } = usePackages();
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleHelpGuide();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        toggleHelpGuide();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [toggleHelpGuide]);

  return (
    <div className="modal-overlay">
      <div 
        ref={modalRef} 
        className="modal-content"
      >
        <div className="modal-header">
          <h2 className="modal-title flex items-center">
            <HelpCircle className="mr-2 text-orange-500" size={24} />
            Package Tracking Help Guide
          </h2>
          <button 
            onClick={toggleHelpGuide}
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <section className="help-guide-section">
            <h3 className="help-guide-section-title">Overview</h3>
            <p className="help-guide-section-content">
              The Package Tracking dashboard provides a comprehensive view of your packages in different stages of the
              shipping process. Packages are organized into three categories: Not Shipped, Shipped, and Delivered.
            </p>
          </section>
          
          <section className="help-guide-section">
            <h3 className="help-guide-section-title">Features</h3>
            <ul className="space-y-3">
              <li className="help-guide-item">
                <Search className="help-guide-item-icon" size={18} />
                <div>
                  <p className="help-guide-item-title">Search</p>
                  <p className="help-guide-item-desc">
                    Use the search bar to filter packages by name, package ID, order ID, or carrier.
                  </p>
                </div>
              </li>
              
              <li className="help-guide-item">
                <List className="help-guide-item-icon" size={18} />
                <div>
                  <p className="help-guide-item-title">List View</p>
                  <p className="help-guide-item-desc">
                    Display packages in a vertical list format, ideal for scanning through many packages.
                  </p>
                </div>
              </li>
              
              <li className="help-guide-item">
                <LayoutGrid className="help-guide-item-icon" size={18} />
                <div>
                  <p className="help-guide-item-title">Grid View</p>
                  <p className="help-guide-item-desc">
                    Display packages in a side-by-side grid layout, showing all package categories at once.
                  </p>
                </div>
              </li>
              
              <li className="help-guide-item">
                <Package className="help-guide-item-icon" size={18} />
                <div>
                  <p className="help-guide-item-title">Package Categories</p>
                  <p className="help-guide-item-desc">
                    Packages are color-coded by status: blue for not shipped, yellow for shipped, and green for delivered.
                  </p>
                </div>
              </li>
            </ul>
          </section>
          
          <section className="help-guide-section">
            <h3 className="help-guide-section-title">Package Information</h3>
            <p className="help-guide-section-content mb-3">
              Each package card displays the following information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Package name</li>
              <li>Package ID (PCK-XX)</li>
              <li>Order ID (SO-XX)</li>
              <li>Shipping carrier (when applicable)</li>
              <li>Date of shipment or expected delivery</li>
              <li>Package value</li>
            </ul>
          </section>
          
          <section className="help-guide-section">
            <h3 className="help-guide-section-title">Tips</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
              <li>Use the search feature to quickly find specific packages</li>
              <li>Switch between list and grid views based on your preference</li>
              <li>Use the checkbox to mark packages for processing (in a future update)</li>
              <li>Click on a package to view more details (in a future update)</li>
            </ul>
          </section>
        </div>
        
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button 
            onClick={toggleHelpGuide}
            className="btn btn-primary"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

const PackageContainer = () => {
  const { getPackagesByStatus, viewType } = usePackages();

  const notShippedPackages = getPackagesByStatus('not-shipped');
  const shippedPackages = getPackagesByStatus('shipped');
  const deliveredPackages = getPackagesByStatus('delivered');

  return (
    <div className={`package-container ${viewType === 'list' ? 'list-view' : 'grid-view'}`}>
      <PackageSection 
        title="Packages, Not Shipped" 
        packages={notShippedPackages} 
        status="not-shipped"
      />
      <PackageSection 
        title="Shipped Packages" 
        packages={shippedPackages} 
        status="shipped"
      />
      <PackageSection 
        title="Delivered Packages" 
        packages={deliveredPackages} 
        status="delivered"
      />
    </div>
  );
};

const PackageTracker = () => {
  const [packages, setPackages] = useState(mockPackages);
  const [viewType, setViewType] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [filteredPackages, setFilteredPackages] = useState(mockPackages);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPackages(packages);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = packages.filter(pkg => 
        pkg.name.toLowerCase().includes(lowercasedSearch) ||
        pkg.packageId.toLowerCase().includes(lowercasedSearch) ||
        pkg.orderId.toLowerCase().includes(lowercasedSearch) ||
        (pkg.carrier && pkg.carrier.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredPackages(filtered);
    }
  }, [searchTerm, packages]);

  const getPackagesByStatus = (status) => {
    return filteredPackages.filter(pkg => pkg.status === status);
  };

  const toggleHelpGuide = () => {
    setShowHelpGuide(prev => !prev);
  };

  const toggleAddPackage = () => {
    setShowAddPackage(prev => !prev);
  };

  const toggleViewType = () => {
    setViewType(prevView => prevView === 'list' ? 'grid' : 'list');
  };

  return (
    <PackageContext.Provider 
      value={{
        packages,
        setPackages,
        viewType,
        searchTerm,
        showHelpGuide,
        setSearchTerm,
        toggleViewType,
        getPackagesByStatus,
        toggleHelpGuide,
        toggleAddPackage
      }}
    >
      <div className="package-tracker">
        <Header />
        <main>
          <PackageContainer />
        </main>
        {showHelpGuide && <HelpGuide />}
        {showAddPackage && <AddPackageModal onClose={toggleAddPackage} />}
      </div>
    </PackageContext.Provider>
  );
};

export default PackageTracker;