import React from 'react';
import { Button } from 'antd';
import GridLayout, { Layout } from 'react-grid-layout';
import ChartCard, { ReportChart } from './ChartCard';

interface ReportFilter {
  id: string;
  name: string;
  type: 'singleSelect' | 'multiSelect' | 'text' | 'date';
  options?: Array<{ label: string; value: string }>;
}

interface ChartDataItem {
  date: string;
  value: number;
}

interface ReportTab {
  id: string;
  name: string;
  filters: ReportFilter[];
  charts: ReportChart[];
}

interface ReportTabPanelProps {
  tab: ReportTab;
  filters: Record<string, any>;
  chartData: Record<string, ChartDataItem[]>;
  loading?: boolean;
  onAddFilter: () => void;
  onApply: () => void;
  onAddChart: () => void;
  onDeleteChart: (id: string) => void;
  onViewSQL: (id: string) => void;
  onLayoutChange: (layout: Layout[]) => void;
  layouts: Record<string, Layout>;
}

const ReportTabPanel: React.FC<ReportTabPanelProps> = ({
  tab, filters, chartData, loading,
  onAddFilter, onApply, onAddChart, onDeleteChart, onViewSQL, onLayoutChange, layouts
}) => {
  return (
    <div>
      {/* Filter区 */}
      <div className="relative flex flex-wrap gap-x-6 gap-y-4 items-end min-h-[80px] pb-12">
        {tab.filters.map(f => (
          <div key={f.id} className="flex flex-col min-w-[160px]">
            <span className="mb-1 text-gray-600 text-sm">{f.name}</span>
            <input value={filters[f.id] || ''} style={{ minWidth: 160 }} readOnly className="ant-input" />
          </div>
        ))}
        <Button type="dashed" onClick={onAddFilter} className="self-end">添加筛选项</Button>
        <div className="absolute right-0 bottom-0">
          <Button type="primary" onClick={onApply}>Apply</Button>
        </div>
      </div>
      {/* Chart区 */}
      <div className="mb-4 flex justify-end">
        <Button type="dashed" onClick={onAddChart}>添加图表</Button>
      </div>
      <GridLayout
        className="layout"
        layout={tab.charts.map(chart => layouts[chart.id] || {
          i: chart.id,
          x: chart.position.x,
          y: chart.position.y,
          w: chart.position.w,
          h: chart.position.h,
        })}
        cols={12}
        rowHeight={30}
        width={900}
        onLayoutChange={onLayoutChange}
        isDraggable
        isResizable
      >
        {tab.charts.map(chart => (
          <div key={chart.id}>
            <ChartCard
              chart={chart}
              chartData={chartData[chart.id]}
              loading={loading}
              onDelete={onDeleteChart}
              onViewSQL={onViewSQL}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default ReportTabPanel; 