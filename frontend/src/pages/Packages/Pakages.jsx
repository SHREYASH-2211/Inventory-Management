import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { Search, LayoutGrid, List, HelpCircle, AlignJustify, X, Package, Plus } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
      >
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Add New Package</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Channel *
              </label>
              <select
                required
                value={formData.channel}
                onChange={(e) => setFormData({...formData, channel: e.target.value})}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Direct Sales">Direct Sales</option>
                <option value="Online">Online</option>
                <option value="Wholesale">Wholesale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Invoiced">Invoiced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Email
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                className="w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter customer email"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-grow">
                    <select
                      required
                      value={item.itemId}
                      onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select an item</option>
                      {mockItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.name} - ${item.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.totalAmount}
              onChange={(e) => setFormData({...formData, totalAmount: parseFloat(e.target.value)})}
              className="w-full rounded-md border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
    <div className="bg-white rounded-md shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <input 
              type="checkbox" 
              className="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <h3 className="font-medium text-gray-900">{pkg.name}</h3>
          </div>
          <div className="flex flex-wrap gap-x-4 text-sm text-gray-500">
            <span>{pkg.packageId}</span>
            <span>{pkg.orderId}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 text-sm text-gray-500 mt-1">
            {pkg.carrier && <span>{pkg.carrier}</span>}
            <span>{pkg.date}</span>
          </div>
        </div>
        <span className="font-medium text-gray-900">{pkg.amount}</span>
      </div>
    </div>
  );
  
  const gridView = (
    <div className="bg-white rounded-md shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <input 
          type="checkbox" 
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex flex-col flex-grow">
          <h3 className="font-medium text-gray-900 mb-1">{pkg.name}</h3>
          <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-500">
            <span>{pkg.packageId}</span>
            <span>{pkg.orderId}</span>
            {pkg.carrier && <span>{pkg.carrier}</span>}
            <span>{pkg.date}</span>
          </div>
        </div>
        <span className="font-medium text-gray-900">{pkg.amount}</span>
      </div>
    </div>
  );
  
  return viewType === 'list' ? listView : gridView;
};

const PackageSection = ({ title, packages, bgColor, borderColor }) => {
  const { viewType } = usePackages();

  return (
    <div className={`rounded-lg overflow-hidden ${bgColor} border ${borderColor} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b border-opacity-30 border-gray-400">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        <AlignJustify size={18} className="text-gray-500" />
      </div>
      
      <div className={`p-4 ${viewType === 'grid' ? 'space-y-4' : 'space-y-2'}`}>
        {packages.length === 0 ? (
          <div className="text-center p-4 text-gray-500">No packages found</div>
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
    <header className="bg-white shadow-sm py-4 px-6 sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">All Packages</h1>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search packages..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              onClick={toggleAddPackage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={20} />
              <span>New</span>
            </button>
            
            <div className="inline-flex border border-gray-300 rounded-md overflow-hidden">
              <button 
                onClick={() => viewType !== 'list' && toggleViewType()}
                className={`p-2 ${viewType === 'list' ? 'bg-gray-100 text-blue-600' : 'bg-white text-gray-600'} transition-colors`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => viewType !== 'grid' && toggleViewType()}
                className={`p-2 ${viewType === 'grid' ? 'bg-gray-100 text-blue-600' : 'bg-white text-gray-600'} transition-colors`}
                aria-label="Grid view"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
            
            <button 
              onClick={toggleHelpGuide}
              className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors"
              aria-label="Help"
            >
              <HelpCircle size={20} />
            </button>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef} 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
      >
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <HelpCircle className="mr-2 text-orange-500" size={24} />
            Package Tracking Help Guide
          </h2>
          <button 
            onClick={toggleHelpGuide}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Overview</h3>
            <p className="text-gray-600">
              The Package Tracking dashboard provides a comprehensive view of your packages in different stages of the
              shipping process. Packages are organized into three categories: Not Shipped, Shipped, and Delivered.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Features</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Search className="mt-1 mr-3 text-blue-500 flex-shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-700">Search</p>
                  <p className="text-gray-600">
                    Use the search bar to filter packages by name, package ID, order ID, or carrier.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <List className="mt-1 mr-3 text-blue-500 flex-shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-700">List View</p>
                  <p className="text-gray-600">
                    Display packages in a vertical list format, ideal for scanning through many packages.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <LayoutGrid className="mt-1 mr-3 text-blue-500 flex-shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-700">Grid View</p>
                  <p className="text-gray-600">
                    Display packages in a side-by-side grid layout, showing all package categories at once.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <Package className="mt-1 mr-3 text-blue-500 flex-shrink-0" size={18} />
                <div>
                  <p className="font-medium text-gray-700">Package Categories</p>
                  <p className="text-gray-600">
                    Packages are color-coded by status: blue for not shipped, yellow for shipped, and green for delivered.
                  </p>
                </div>
              </li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Package Information</h3>
            <p className="text-gray-600 mb-3">
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
          
          <section>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Tips</h3>
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
    <div className={`grid gap-6 ${viewType === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
      <PackageSection 
        title="Packages, Not Shipped" 
        packages={notShippedPackages} 
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
      />
      <PackageSection 
        title="Shipped Packages" 
        packages={shippedPackages} 
        bgColor="bg-yellow-50"
        borderColor="border-yellow-200"
      />
      <PackageSection 
        title="Delivered Packages" 
        packages={deliveredPackages} 
        bgColor="bg-green-50"
        borderColor="border-green-200"
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
      <div className="min-h-screen bg-gray-50 pb-10">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <PackageContainer />
        </main>
        {showHelpGuide && <HelpGuide />}
        {showAddPackage && <AddPackageModal onClose={toggleAddPackage} />}
      </div>
    </PackageContext.Provider>
  );
};

export default PackageTracker;