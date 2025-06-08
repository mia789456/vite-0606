import React, { useState } from 'react';
import { createContext, useContextSelector , useContext} from 'use-context-selector';


const DemoContext = createContext(null);


// 创建 Provider 组件
const DemoProvider: React.FC = ({ children }) => {
  const [demoValue, setDemoValue] = useState({
    count: 1,
    age: 10,
  })
  const [val, setVal] = useState(0);

  const onBtnClick = () => {
    setVal(prevCount => prevCount + 1);
  }

  const onCountBtnClick = () => {
    setDemoValue((prev) => {
        return {
           ...prev,
           count: prev.count+1,
        }
    })
  }

  return (
    <DemoContext.Provider value={{demoValue, onCountBtnClick}}>
        <button onClick={onBtnClick}>DemoProviderValBtn {val}</button>
        <button onClick={onCountBtnClick}>DemoProviderCountBtn {demoValue.count} / {demoValue.age}</button>
      {children}
    </DemoContext.Provider>
  );
};


export { DemoContext, DemoProvider };


