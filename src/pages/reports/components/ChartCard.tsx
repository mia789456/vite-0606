import React from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { Empty } from 'antd';

interface ChartDataItem {
  date: string;
  value: number;
}

export interface ReportChart {
  id: string;
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

interface ChartCardProps {
  chart: ReportChart;
  chartData?: ChartDataItem[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  onViewSQL?: (id: string) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ chart, chartData, loading, onDelete, onViewSQL }) => {
  const menu = (
    <Menu>
      <Menu.Item key="view-sql" onClick={() => onViewSQL?.(chart.id)}>查看SQL</Menu.Item>
      <Menu.Item key="delete" danger onClick={() => onDelete?.(chart.id)}>删除chart</Menu.Item>
    </Menu>
  );
  return (
    <div className="bg-gray-50 p-4 rounded flex flex-col h-full justify-between">
      {/* 上部分：标题+操作 */}
      <div className="flex items-center justify-between mb-2 w-full">
        <div className="font-semibold text-base truncate" title={chart.title}>{chart.title}</div>
        <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      </div>
      {/* 下部分：图表 */}
      <div className="flex-1 flex items-center justify-center h-full">
        {loading ? <span>加载中...</span> : (chartData && chartData.length > 0 ? (
          <ReactECharts
            option={{
              tooltip: { trigger: 'axis' },
              xAxis: {
                type: 'category',
                data: chartData.map(d => d.date),
              },
              yAxis: { type: 'value' },
              series: [
                {
                  data: chartData.map(d => d.value),
                  type: 'line',
                  smooth: true,
                  name: chart.title,
                },
              ],
            }}
            style={{ width: '100%', height: '100%' }}
          />
        ) : <Empty description="暂无数据" />)}
      </div>
    </div>
  );
};

export default ChartCard; 