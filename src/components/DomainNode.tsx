import React from "react";

interface DomainNodeProps {
  title: string;
  list: string[];
}

const DomainNode: React.FC<DomainNodeProps> = ({ title, list }) => (
  <div className="w-[300px] rounded-lg border border-gray-300 bg-white shadow-md m-4">
    <div className="p-4 border-b border-dashed border-gray-400">
      <strong>{title}</strong>
    </div>
    <ul className="p-4 list-none m-0">
      {list.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  </div>
);

export default DomainNode; 