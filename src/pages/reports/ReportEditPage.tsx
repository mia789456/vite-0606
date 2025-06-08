import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Button, Input, Select, Modal, message, Spin, Drawer, Empty, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import GridLayout, { Layout } from 'react-grid-layout';
import { fetchReport, fetchChartData } from '@/services/reportService';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { metricsAPI, Metric } from '@/services/api';
import ReactECharts from 'echarts-for-react';
import ChartCard from './components/ChartCard';
import ReportTabPanel from './components/ReportTabPanel';
import MetricDrawer from './components/MetricDrawer';

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

type FilterState = Record<string, string | string[] | undefined>;
type ChartLayoutState = Record<string, Record<string, Layout>>;

const DEFAULT_CHART_W = 6;
const DEFAULT_CHART_H = 12;

interface ChartDataItem {
  date: string;
  value: number;
}

const ReportEditPage: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>({});
  const [layouts, setLayouts] = useState<ChartLayoutState>({});
  const [editMode, setEditMode] = useState(true); // 预览/编辑切换
  const [tabModal, setTabModal] = useState<{ visible: boolean; name: string }>({ visible: false, name: '' });
  const [filterModal, setFilterModal] = useState<{ visible: boolean; type: string; name: string }>({ visible: false, type: 'singleSelect', name: '' });
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState<string>('');
  const [metricsDrawer, setMetricsDrawer] = useState(false);
  const [metricsList, setMetricsList] = useState<Metric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [chartData, setChartData] = useState<Record<string, ChartDataItem[]>>({});
  const [applyLoading, setApplyLoading] = useState(false);

  // 获取报表详情
  useEffect(() => {
    if (!dashboardId) return;
    setLoading(true);
    fetchReport(dashboardId)
      .then(res => {
        setReport(res.data.data);
        if (res.data.data.tabs?.length > 0) {
          setActiveTab(res.data.data.tabs[0].id);
        }
      })
      .catch(() => {
        message.error('获取报表信息失败');
      })
      .finally(() => setLoading(false));
  }, [dashboardId]);

  // 切换tab时初始化filter
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
    // 初始化当前tab的layout
    setLayouts(prev => {
      if (prev[activeTab]) return prev;
      const tabLayouts: Record<string, Layout> = {};
      tab.charts.forEach((chart) => {
        tabLayouts[chart.id] = {
          i: chart.id,
          x: chart.position.x,
          y: chart.position.y,
          w: chart.position.w,
          h: chart.position.h,
        };
      });
      return { ...prev, [activeTab]: tabLayouts };
    });
    // 自动请求chart数据
    fetchAllChartsData(tab.charts, initial);
  }, [activeTab, report]);

  // react-grid-layout布局变更
  const onLayoutChange = (layout: Layout[]) => {
    setLayouts(prev => {
      const tabLayouts = { ...(prev[activeTab] || {}) };
      layout.forEach(l => {
        tabLayouts[l.i] = l;
      });
      return { ...prev, [activeTab]: tabLayouts };
    });
    // TODO: 更新report.tabs中对应chart的position
  };

  // Tab操作
  const handleAddTab = () => setTabModal({ visible: true, name: '' });
  const handleTabModalOk = () => {
    if (!tabModal.name.trim() || !report) return;
    const newTab: ReportTab = {
      id: `tab${Date.now()}`,
      name: tabModal.name,
      filters: [],
      charts: [],
    };
    setReport({ ...report, tabs: [...report.tabs, newTab] });
    setActiveTab(newTab.id);
    setTabModal({ visible: false, name: '' });
  };

  // Filter操作
  const handleAddFilter = () => setFilterModal({ visible: true, type: 'singleSelect', name: '' });
  const handleFilterModalOk = () => {
    if (!filterModal.name.trim() || !report) return;
    const tabIdx = report.tabs.findIndex(t => t.id === activeTab);
    if (tabIdx === -1) return;
    const newFilter: ReportFilter = {
      id: `f${Date.now()}`,
      name: filterModal.name,
      type: filterModal.type as any,
      options: filterModal.type === 'singleSelect' || filterModal.type === 'multiSelect' ? [] : undefined,
    };
    const newTabs = [...report.tabs];
    newTabs[tabIdx] = {
      ...newTabs[tabIdx],
      filters: [...newTabs[tabIdx].filters, newFilter],
    };
    setReport({ ...report, tabs: newTabs });
    setFilterModal({ visible: false, type: 'singleSelect', name: '' });
  };

  // Tab编辑
  const handleTabEdit = (tabId: string, name: string) => {
    setEditingTabId(tabId);
    setEditingTabName(name);
  };
  const handleTabNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTabName(e.target.value);
  };
  const handleTabNameSave = (tabId: string) => {
    if (!report) return;
    const newTabs = report.tabs.map(tab => tab.id === tabId ? { ...tab, name: editingTabName.trim() || tab.name } : tab);
    setReport({ ...report, tabs: newTabs });
    setEditingTabId(null);
    setEditingTabName('');
  };
  // 删除Tab
  const handleRemoveTab = (tabId: string) => {
    if (!report) return;
    const newTabs = report.tabs.filter(tab => tab.id !== tabId);
    const newActive = newTabs.length > 0 ? newTabs[0].id : '';
    setReport({ ...report, tabs: newTabs });
    setActiveTab(newActive);
  };

  // Chart操作 - 打开Drawer
  const handleAddChart = async () => {
    setMetricsLoading(true);
    setMetricsDrawer(true);
    try {
      const res = await metricsAPI.getMetrics({ pageSize: 100 });
      setMetricsList(res.data.list as Metric[] || []);
    } catch {
      setMetricsList([] as Metric[]);
    } finally {
      setMetricsLoading(false);
    }
  };
  // Drawer中点击metric添加chart
  const handleAddMetricToChart = async (metric: Metric) => {
    if (!report) return;
    const tabIdx = report.tabs.findIndex(t => t.id === activeTab);
    if (tabIdx === -1) return;
    const newChart: ReportChart = {
      id: metric.id,
      title: metric.name,
      position: { x: 0, y: 0, w: DEFAULT_CHART_W, h: DEFAULT_CHART_H },
    };
    // 避免重复添加
    const exist = report.tabs[tabIdx].charts.find(c => c.id === metric.id);
    if (exist) {
      message.warning('该指标已添加');
      return;
    }
    const newTabs = [...report.tabs];
    newTabs[tabIdx] = {
      ...newTabs[tabIdx],
      charts: [...newTabs[tabIdx].charts, newChart],
    };
    setReport({ ...report, tabs: newTabs });
    // 只拉取新加metric的数据
    setApplyLoading(true);
    try {
      const res = await fetchChartData(metric.id, filters);
      setChartData(prev => ({ ...prev, [metric.id]: res.data.data }));
    } catch {
      setChartData(prev => ({ ...prev, [metric.id]: [] }));
    } finally {
      setApplyLoading(false);
    }
    setMetricsDrawer(false);
  };
  // 删除chart
  const handleRemoveChart = (chartId: string) => {
    if (!report) return;
    const tabIdx = report.tabs.findIndex(t => t.id === activeTab);
    if (tabIdx === -1) return;
    const newTabs = [...report.tabs];
    newTabs[tabIdx] = {
      ...newTabs[tabIdx],
      charts: newTabs[tabIdx].charts.filter(c => c.id !== chartId),
    };
    setReport({ ...report, tabs: newTabs });
  };

  // 批量请求chart数据
  const fetchAllChartsData = async (charts: ReportChart[], filterState: Record<string, string | string[] | undefined>) => {
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

  // 保存按钮点击
  const handleSave = () => {
    if (!report) return;
    // 组装Report结构
    const result = {
      id: report.id,
      name: report.name,
      description: report.description,
      tabs: report.tabs.map(tab => ({
        id: tab.id,
        name: tab.name,
        filters: tab.filters.map(f => ({
          id: f.id,
          name: f.name,
          type: f.type,
          options: f.options,
        })),
        charts: tab.charts.map(c => {
          const l = layouts[tab.id]?.[c.id];
          return {
            id: c.id,
            title: c.title,
            position: l ? { x: l.x, y: l.y, w: l.w, h: l.h } : c.position,
          };
        }),
      })),
    };
    console.log('保存的Report结构:', result);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>;
  }
  if (!report) {
    return <div className="my-12 text-center text-gray-500">未找到该报表</div>;
  }

  const tabItems = report.tabs.map(tab => ({
    key: tab.id,
    label: editingTabId === tab.id ? (
      <Input
        size="small"
        value={editingTabName}
        autoFocus
        style={{ width: 100 }}
        onChange={handleTabNameChange}
        onBlur={() => handleTabNameSave(tab.id)}
        onPressEnter={() => handleTabNameSave(tab.id)}
      />
    ) : (
      <span onClick={() => handleTabEdit(tab.id, tab.name)} style={{ cursor: 'pointer' }}>
        {tab.name}
      </span>
    ),
    children: (
      <ReportTabPanel
        tab={tab}
        filters={filters}
        chartData={chartData}
        loading={applyLoading}
        onAddFilter={handleAddFilter}
        onApply={() => {}}
        onAddChart={handleAddChart}
        onDeleteChart={handleRemoveChart}
        onViewSQL={id => message.info('TODO: 查看SQL')}
        onLayoutChange={onLayoutChange}
        layouts={layouts[tab.id] || {}}
      />
    ),
    closable: true,
  }));

  // Tabs区加号按钮
  const renderTabBarExtra = () => (
    <Button type="dashed" size="small" onClick={handleAddTab}>+ 新增Tab</Button>
  );

  return (
    <div className="p-8 bg-white rounded shadow">
      {/* 顶部标题区 */}
      <div className="flex items-center mb-4 gap-4">
        <Input
          className="text-2xl font-bold"
          value={report.name}
          onChange={e => setReport({ ...report, name: e.target.value })}
          style={{ width: 300 }}
        />
        <Input
          className="text-gray-500"
          value={report.description}
          onChange={e => setReport({ ...report, description: e.target.value })}
          style={{ width: 400 }}
        />
        <Button onClick={() => setEditMode(!editMode)}>{editMode ? '预览' : '编辑'}</Button>
        <Button type="primary" onClick={handleSave}>保存</Button>
      </div>
      {/* Tabs区 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="editable-card"
        items={tabItems}
        tabBarExtraContent={renderTabBarExtra()}
        onEdit={(targetKey, action) => {
          if (action === 'remove') handleRemoveTab(targetKey as string);
        }}
      />
      {/* 新增Tab Modal */}
      <Modal
        title="新增Tab"
        open={tabModal.visible}
        onOk={handleTabModalOk}
        onCancel={() => setTabModal({ visible: false, name: '' })}
      >
        <Input
          placeholder="请输入Tab名称"
          value={tabModal.name}
          onChange={e => setTabModal({ ...tabModal, name: e.target.value })}
        />
      </Modal>
      {/* 新增Filter Modal */}
      <Modal
        title="新增筛选项"
        open={filterModal.visible}
        onOk={handleFilterModalOk}
        onCancel={() => setFilterModal({ visible: false, type: 'singleSelect', name: '' })}
      >
        <Input
          placeholder="请输入筛选项名称"
          value={filterModal.name}
          onChange={e => setFilterModal({ ...filterModal, name: e.target.value })}
          className="mb-2"
        />
        <Select
          value={filterModal.type}
          onChange={v => setFilterModal({ ...filterModal, type: v })}
          style={{ width: 200 }}
          options={[
            { label: '单选下拉', value: 'singleSelect' },
            { label: '多选下拉', value: 'multiSelect' },
            { label: '文本输入', value: 'text' },
            { label: '日期区间', value: 'date' },
          ]}
        />
      </Modal>
      {/* 右侧Drawer：选择指标 */}
      <MetricDrawer
        open={metricsDrawer}
        loading={metricsLoading}
        metrics={metricsList}
        onClose={() => setMetricsDrawer(false)}
        onAddMetric={handleAddMetricToChart}
      />
    </div>
  );
};

export default ReportEditPage; 