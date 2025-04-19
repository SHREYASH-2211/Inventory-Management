import React from 'react';
import { FileText, FilePlus, FileSearch, FileCheck, ArrowDownToLine, Settings } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  const actions = [
    { id: 'new', icon: FilePlus, label: 'New', color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'draft', icon: FileText, label: 'Draft', color: 'bg-gray-600 hover:bg-gray-700' },
    { id: 'pending', icon: FileSearch, label: 'Pending', color: 'bg-yellow-600 hover:bg-yellow-700' },
    { id: 'approved', icon: FileCheck, label: 'Approved', color: 'bg-green-600 hover:bg-green-700' },
    { id: 'import', icon: ArrowDownToLine, label: 'Import', color: 'bg-purple-600 hover:bg-purple-700' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'bg-gray-700 hover:bg-gray-800' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sales Order Management</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {actions.map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`${color} p-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex flex-col items-center justify-center space-y-4 w-full text-white`}
            >
              <Icon size={32} />
              <span className="text-lg font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;