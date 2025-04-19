import React from 'react';
import { ClipboardList } from 'lucide-react';

const Header = ({ title }) => {
  return (
    <div className="flex items-center mb-8">
      <div className="bg-blue-600 p-3 rounded-lg mr-4">
        <ClipboardList size={24} className="text-white" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default Header;