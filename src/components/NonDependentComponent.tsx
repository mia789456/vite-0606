import React from 'react';

const NonDependentComponent: React.FC = () => {
  console.log('NonDependentComponent 渲染');

  return (
    <div>
      <p>这是一个不依赖 Context 的组件</p>
    </div>
  );
};

export default NonDependentComponent;