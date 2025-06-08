import React, { memo } from 'react';
import {useContextSelector, useContext } from 'use-context-selector';

import { DemoContext } from '../contexts/DemoContext';

const CountConsumer: React.FC = () => {
    const count = useContextSelector(DemoContext, (state) => state.demoValue.count);

  console.log('ContextConsumer 渲染');

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
};

const AgeConsumer: React.FC = () => {
    const age = useContextSelector(DemoContext, (state) => state.demoValue.age);
    const onCountBtnClick = useContextSelector(DemoContext, (state) => state.onCountBtnClick);
    console.log('AgeConsumer 渲染');
  
    return (
      <div>
        <p>Age: {age}</p>
        <button onClick={onCountBtnClick}>{age}</button>
      </div>
    );
};


export  { CountConsumer, AgeConsumer };