import React from 'react';
import DomainTree from '../components/DomainTree';

const TreePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Domain Tree 视图</h1>
          <p className="text-gray-600 mt-1">展示组织结构的树状图</p>
        </div>
      </div>
      <DomainTree />
    </div>
  );
};

export default TreePage; 