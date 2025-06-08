import React from "react";

const Home: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[60vh]">
    <h1 className="text-4xl font-bold mb-4">欢迎来到首页！</h1>
    <p className="text-lg text-gray-600">这里是一个随机的首页内容：{Math.random().toFixed(4)}</p>
  </div>
);

export default Home; 