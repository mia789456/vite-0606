import React, { useState } from 'react';
import { createContext, useContext } from "use-context-selector";

const context = createContext(null);

const Count1 = () => {
    const { count1, setCount1 } = useContext(context);
    console.log("Count1 render");
    const value = Math.random();
    return <div onClick={() => setCount1(count1 + 1)}>count1: {count1} {value}</div>;
  };
  
  const Count2 = () => {
    const { count2 } = useContext(context);
    console.log("Count2 render");
    const value = Math.random();
    return <div>count2: {count2} {value}</div>;
};
  

const Provider = ({ children }) => {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  return (
    <context.Provider
      value={{
        count1,
        count2,
        setCount1,
        setCount2
      }}
    >
      {children}
    </context.Provider>
  );
};


  


const ContextDemo: React.FC = () => {
  return <>
        This is DemoProvider
        <Provider>
            <Count1 />
            <Count2 />
        </Provider>
    </>
};

export default ContextDemo;