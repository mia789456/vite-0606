import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Spin, Empty, Button, Select, Input, DatePicker, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import { fetchReport, fetchChartData } from '@/services/reportService';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const { RangePicker } = DatePicker;

// 类型定义
interface ReportFilter {
  id: string;
  name: string;
  type: 'singleSelect' | 'multiSelect' | 'text' | 'date';
  options?: Array<{ label: string; value: string }>;
}
interface ReportChart {
  id: string;
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
interface ReportTab {
  id: string;
  name: string;
  filters: ReportFilter[];
  charts: ReportChart[];
}
interface Report {
  id: string;
  name: string;
  description?: string;
  tabs: ReportTab[];
}

interface ChartDataItem {
  date: string;
  value: number;
}

type FilterState = Record<string, any>;

type ChartLayoutState = Record<string, Layout>;

const DEFAULT_CHART_W = 6;
const DEFAULT_CHART_H = 12;

const ReportViewPage: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({});
  const [chartData, setChartData] = useState<Record<string, ChartDataItem[]>>({});
  const [applyLoading, setApplyLoading] = useState(false);
  const [layouts, setLayouts] = useState<ChartLayoutState>({});

  // 获取报表详情
  useEffect(() => {
    if (!dashboardId) return;
    setLoading(true);
    fetchReport(dashboardId)
      .then(res => {
        setReport(res.data.data);
        if (res.data.data.tabs?.length > 0) {
          setActiveTab(res.data.data.tabs[0].id);
          // 初始化filter state
          const firstTab = res.data.data.tabs[0];
          const initial: FilterState = {};
          firstTab.filters.forEach((f: ReportFilter) => {
            if (f.type === 'multiSelect') initial[f.id] = [];
            else if (f.type === 'singleSelect') initial[f.id] = undefined;
            else if (f.type === 'text') initial[f.id] = '';
            else if (f.type === 'date') initial[f.id] = [];
          });
          setFilters(initial);
          // 初始化chart布局
          const chartLayouts: ChartLayoutState = {};
          firstTab.charts.forEach((chart) => {
            chartLayouts[chart.id] = {
              i: chart.id,
              x: chart.position.x,
              y: chart.position.y,
              w: chart.position.w,
              h: chart.position.h,
            };
          });
          setLayouts(chartLayouts);
          // 自动请求chart数据
          fetchAllChartsData(firstTab.charts, initial);
        }
      })
      .catch(() => {
        message.error('获取报表信息失败');
      })
      .finally(() => setLoading(false));
  }, [dashboardId]);

  // 切换tab时初始化filter和布局，并自动请求chart数据
  useEffect(() => {
    if (!report || !activeTab) return;
    const tab = report.tabs.find(t => t.id === activeTab);
    if (!tab) return;
    const initial: FilterState = {};
    tab.filters.forEach((f: ReportFilter) => {
      if (f.type === 'multiSelect') initial[f.id] = [];
      else if (f.type === 'singleSelect') initial[f.id] = undefined;
      else if (f.type === 'text') initial[f.id] = '';
      else if (f.type === 'date') initial[f.id] = [];
    });
    setFilters(initial);
    setChartData({});
    // 初始化chart布局
    const chartLayouts: ChartLayoutState = {};
    tab.charts.forEach((chart) => {
      chartLayouts[chart.id] = {
        i: chart.id,
        x: chart.position.x,
        y: chart.position.y,
        w: chart.position.w,
        h: chart.position.h,
      };
    });
    setLayouts(chartLayouts);
    // 自动请求chart数据
    fetchAllChartsData(tab.charts, initial);
  }, [activeTab, report]);

  // 批量请求chart数据
  const fetchAllChartsData = async (charts: ReportChart[], filterState: FilterState) => {
    setApplyLoading(true);
    const newChartData: Record<string, ChartDataItem[]> = {};
    await Promise.all(charts.map(async (chart) => {
      try {
        const res = await fetchChartData(chart.id, filterState);
        newChartData[chart.id] = res.data.data;
      } catch {
        newChartData[chart.id] = [];
      }
    }));
    setChartData(newChartData);
    setApplyLoading(false);
  };

  // 处理filter变化
  const handleFilterChange = (fid: string, value: any) => {
    setFilters(prev => ({ ...prev, [fid]: value }));
  };

  // react-grid-layout布局变更
  const onLayoutChange = (layout: Layout[]) => {
    const newLayouts: ChartLayoutState = { ...layouts };
    layout.forEach(l => {
      newLayouts[l.i] = l;
    });
    setLayouts(newLayouts);
  };

  // Apply按钮点击，拉取所有chart数据
  const handleApply = async () => {
    if (!report) return;
    const tab = report.tabs.find(t => t.id === activeTab);
    if (!tab) return;
    fetchAllChartsData(tab.charts, filters);
  };

  // 渲染filter区
  const renderFilterSection = (tab: ReportTab) => (
    <div className="relative flex flex-wrap gap-x-6 gap-y-4 items-end min-h-[80px] pb-12">
      {tab.filters.map(f => (
        <div key={f.id} className="flex flex-col min-w-[160px]">
          <span className="mb-1 text-gray-600 text-sm">{f.name}</span>
          {f.type === 'singleSelect' && (
            <Select
              value={filters[f.id]}
              onChange={v => handleFilterChange(f.id, v)}
              style={{ minWidth: 160 }}
              placeholder={`请选择${f.name}`}
              options={f.options || []}
            />
          )}
          {f.type === 'multiSelect' && (
            <Select
              mode="multiple"
              value={filters[f.id]}
              onChange={v => handleFilterChange(f.id, v)}
              style={{ minWidth: 160 }}
              placeholder={`请选择${f.name}`}
              options={f.options || []}
            />
          )}
          {f.type === 'text' && (
            <Input
              value={filters[f.id]}
              onChange={e => handleFilterChange(f.id, e.target.value)}
              style={{ minWidth: 160 }}
              placeholder={`请输入${f.name}`}
            />
          )}
          {f.type === 'date' && (
            <RangePicker
              value={filters[f.id]}
              onChange={v => handleFilterChange(f.id, v)}
              style={{ minWidth: 220 }}
            />
          )}
        </div>
      ))}
      {/* Apply按钮绝对定位在右下角 */}
      <div className="absolute right-0 bottom-0">
        <Button type="primary" onClick={handleApply} loading={applyLoading}>Apply</Button>
      </div>
    </div>
  );

  // 渲染chart区（react-grid-layout）
  const renderCharts = (tab: ReportTab) => {
    const layoutArr: Layout[] = tab.charts.map(chart =>
      layouts[chart.id] || {
        i: chart.id,
        x: 0,
        y: 0,
        w: DEFAULT_CHART_W,
        h: DEFAULT_CHART_H,
      }
    );
    return (
      <GridLayout
        className="layout"
        layout={layoutArr}
        cols={12}
        rowHeight={30}
        width={900}
        onLayoutChange={onLayoutChange}
        isDraggable={false}
        isResizable={false}
      >
        {tab.charts.map(chart => (
          <div key={chart.id} className="bg-gray-50 p-4 rounded flex items-center justify-center h-full">
            {applyLoading ? <Spin /> : (chartData[chart.id]?.length > 0 ? (
              <ReactECharts
                option={{
                  tooltip: { trigger: 'axis' },
                  xAxis: {
                    type: 'category',
                    data: chartData[chart.id].map(d => d.date),
                  },
                  yAxis: { type: 'value' },
                  series: [
                    {
                      data: chartData[chart.id].map(d => d.value),
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
        ))}
      </GridLayout>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
  }
  if (!report) {
    return <Empty description="未找到该报表" className="my-12" />;
  }

  const tabItems = report.tabs.map(tab => ({
    key: tab.id,
    label: tab.name,
    children: (
      <div>
        {renderFilterSection(tab)}
        {renderCharts(tab)}
      </div>
    ),
  }));

  return (
    <div className="p-8 bg-white rounded shadow">
      {/* 顶部标题区 */}
      <h2 className="text-2xl font-bold mb-2">{report.name}</h2>
      <div className="text-gray-500 mb-6">{report.description}</div>
      {/* Tabs区 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </div>
  );
};

export default ReportViewPage; 