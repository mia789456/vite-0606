import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            欢迎来到我的应用
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            这是一个使用 React + TypeScript + Vite 构建的现代化前端应用
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tree"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看 Domain Tree
            </Link>
            <Link
              to="/buttons"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              查看 Button 组件
            </Link>
            <button className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors">
              了解更多
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 