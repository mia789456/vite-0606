import React from "react";
import DomainNode from "./DomainNode";

// mock数据，参考@test.png描述
const rootNode = {
  title: "Domain Root",
  list: ["root info 1", "root info 2", "root info 3"],
};

const childNodes = [
  { title: "子域1", list: ["item 1", "item 2"] },
  { title: "子域2", list: ["item 3"] },
  { title: "子域3", list: ["item 4", "item 5", "item 6"] },
  { title: "子域4", list: ["item 7"] },
  { title: "子域5", list: ["item 8", "item 9"] },
  { title: "子域6", list: ["item 10"] },
  { title: "子域7", list: ["item 11", "item 12", "item 13"] },
];

const NODE_WIDTH = 300;
const NODE_HEIGHT = 120;
const VERTICAL_GAP = 120;
const HORIZONTAL_GAP = 32;
const BRIDGE_HEIGHT = 100; // 主干高度

const DomainTree: React.FC = () => {
  // 计算布局
  const rootX = (NODE_WIDTH + HORIZONTAL_GAP) * 3.5 / 2;
  const rootY = 0;
  // 第一行4个
  const firstRowY = NODE_HEIGHT + VERTICAL_GAP;
  // 第二行3个，整体居中且位于第一行节点之间
  const secondRowY = NODE_HEIGHT * 2 + VERTICAL_GAP * 2;
  // 第一行4个节点的中心x
  const firstRowCenters = Array(4).fill(0).map((_, i) => i * (NODE_WIDTH + HORIZONTAL_GAP) + NODE_WIDTH / 2);
  // 计算第二行3个节点的中心x，分别在第一行4个节点之间的空隙中点
  const secondRowCenters = Array(3).fill(0).map((_, i) => (firstRowCenters[i] + firstRowCenters[i + 1]) / 2);

  // 计算每个子节点的中心点
  const childCenters = [
    // 第一行4个
    ...firstRowCenters.map(x => ({ x: x - NODE_WIDTH / 2, y: firstRowY })),
    // 第二行3个
    ...secondRowCenters.map(x => ({ x: x - NODE_WIDTH / 2, y: secondRowY })),
  ];

  // SVG宽高
  const svgWidth = (NODE_WIDTH + HORIZONTAL_GAP) * 4 - HORIZONTAL_GAP;
  const svgHeight = NODE_HEIGHT * 3 + VERTICAL_GAP * 2 + 100;

  // 主干横线y坐标
  const bridgeY = rootY + NODE_HEIGHT + BRIDGE_HEIGHT;
  // root节点底部中心
  const rootCenterX = rootX + NODE_WIDTH / 2;
  const rootCenterY = rootY + NODE_HEIGHT;

  // 箭头大小
  const ARROW_SIZE = 10;

  return (
    <div className="relative w-full flex justify-center items-start bg-gray-50 p-10" style={{ minHeight: svgHeight }}>
      {/* SVG连线 */}
      <svg
        width={svgWidth}
        height={svgHeight}
        className="absolute left-1/2"
        style={{
          transform: `translateX(-50%)`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <defs>
          <marker
            id="arrow"
            markerWidth={ARROW_SIZE}
            markerHeight={ARROW_SIZE}
            refX={ARROW_SIZE / 2}
            refY={ARROW_SIZE / 2}
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d={`M0,0 L${ARROW_SIZE},${ARROW_SIZE / 2} L0,${ARROW_SIZE} Z`} fill="#bbb" />
          </marker>
        </defs>
        {/* root到底部主干竖线 */}
        <path
          d={`M${rootCenterX},${rootCenterY} L${rootCenterX},${bridgeY}`}
          stroke="#bbb"
          strokeWidth={2}
          fill="none"
          strokeDasharray="6 4"
        />
        {/* 主干横线 */}
        <path
          d={`M${firstRowCenters[0]},${bridgeY} L${firstRowCenters[3]},${bridgeY}`}
          stroke="#bbb"
          strokeWidth={2}
          fill="none"
          strokeDasharray="6 4"
        />
        {/* 从横线到每个子节点的竖线（带箭头，全部居中） */}
        {childCenters.map((center, idx) => {
          const childCenterX = center.x + NODE_WIDTH / 2;
          const childCenterY = center.y;
          return (
            <path
              key={idx}
              d={`M${childCenterX},${bridgeY} L${childCenterX},${childCenterY}`}
              stroke="#bbb"
              strokeWidth={2}
              fill="none"
              strokeDasharray="6 4"
              markerEnd="url(#arrow)"
            />
          );
        })}
      </svg>
      {/* 节点布局 */}
      <div className="absolute left-1/2" style={{ transform: `translateX(-50%)`, width: svgWidth }}>
        {/* root node */}
        <div style={{ position: "absolute", left: rootX, top: rootY, zIndex: 1 }}>
          <DomainNode {...rootNode} />
        </div>
        {/* 第一行4个子节点 */}
        {childNodes.slice(0, 4).map((node, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: childCenters[idx].x,
              top: childCenters[idx].y,
              zIndex: 1,
            }}
          >
            <DomainNode {...node} />
          </div>
        ))}
        {/* 第二行3个子节点 */}
        {childNodes.slice(4).map((node, idx) => (
          <div
            key={idx + 4}
            style={{
              position: "absolute",
              left: childCenters[idx + 4].x,
              top: childCenters[idx + 4].y,
              zIndex: 1,
            }}
          >
            <DomainNode {...node} />
          </div>
        ))}
      </div>
    </div>
  );
};



export default DomainTree; 