import React, { useEffect, useState, useCallback } from 'react'
import { Typography, Tabs, Descriptions, Select, Input, DatePicker, Button, Table, Spin, Empty, message } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useParams } from 'react-router-dom'
import { metricsAPI } from '../../services/api'
import type { Metric, Dimension } from '../../store/slices/metricsSlice'
import { Dayjs } from 'dayjs'

const { Title, Paragraph } = Typography
const { RangePicker } = DatePicker

interface ChartDataItem {
  date: string;
  value: number;
}
interface InsightItem {
  key: string;
  name: string;
  value: number;
  rank: number;
  percent: string;
}

type FilterState = Record<string, string | string[] | undefined | [Dayjs, Dayjs] | ''>

const MetricDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('analysis')
  const [loading, setLoading] = useState(false)
  const [metric, setMetric] = useState<Metric | null>(null)
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [insightData, setInsightData] = useState<InsightItem[]>([])
  const [initLoading, setInitLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({})

  // 获取metric元数据
  useEffect(() => {
    if (!id) return
    setInitLoading(true)
    metricsAPI.getMetric(id)
      .then(res => {
        setMetric(res.data)
        // 初始化filter state
        const initial: FilterState = {}
        res.data.dimensions.forEach((dim: Dimension) => {
          if (dim.type === 'multiSelect') initial[dim.id] = []
          else if (dim.type === 'singleSelect') initial[dim.id] = undefined
          else if (dim.type === 'text') initial[dim.id] = ''
          else if (dim.type === 'date') initial[dim.id] = []
        })
        setFilters(initial)
        setInitLoading(false)
        fetchChartData(res.data, initial)
      })
      .catch(() => {
        setInitLoading(false)
        message.error('获取指标信息失败')
      })
    // eslint-disable-next-line
  }, [id])

  // 拉取chart数据
  const fetchChartData = useCallback((metricObj: Metric, filters: FilterState) => {
    if (!id) return
    setLoading(true)
    // 日期处理
    const payload: Record<string, string | string[] | undefined> = {}
    metricObj.dimensions.forEach(dim => {
      const val = filters[dim.id]
      if (dim.type === 'date' && Array.isArray(val) && val.length === 2 && val[0] && val[1]) {
        payload[dim.id] = [
          (val[0] as Dayjs).format('YYYY-MM-DD'),
          (val[1] as Dayjs).format('YYYY-MM-DD'),
        ]
      } else if (dim.type === 'multiSelect' && Array.isArray(val)) {
        payload[dim.id] = val as string[]
      } else if (dim.type === 'singleSelect' && (typeof val === 'string' || typeof val === 'undefined')) {
        payload[dim.id] = val
      } else if (dim.type === 'text' && typeof val === 'string') {
        payload[dim.id] = val
      }
    })
    metricsAPI.getMetricData(id, payload)
      .then(res => {
        setChartData(res.data)
        // insight简单处理：排名、百分比
        const sorted = [...(res.data as ChartDataItem[])].sort((a, b) => b.value - a.value)
        const max = sorted[0]?.value || 1
        const insight = (res.data as ChartDataItem[]).map((item) => {
          const rank = sorted.findIndex((d) => d.date === item.date) + 1
          return {
            key: item.date,
            name: item.date,
            value: item.value,
            rank,
            percent: ((item.value / max) * 100).toFixed(0) + '%'
          }
        })
        setInsightData(insight)
      })
      .catch(() => {
        setChartData([])
        setInsightData([])
        message.error('获取指标数据失败')
      })
      .finally(() => setLoading(false))
  }, [id])

  // 处理filter变化
  const handleFilterChange = (dim: Dimension, value: string | string[] | undefined | [Dayjs, Dayjs] | '') => {
    setFilters(prev => ({ ...prev, [dim.id]: value }))
  }

  // Apply按钮点击
  const handleApply = () => {
    if (!metric) return
    fetchChartData(metric, filters)
  }

  // 动态渲染filter组件
  const renderFilterSection = () => {
    if (!metric) return null
    return (
      <div className="flex flex-wrap gap-x-6 gap-y-4 items-end min-h-[80px] pb-4">
        {metric.dimensions.map(dim => {
          let comp = null
          if (dim.type === 'singleSelect') {
            comp = (
              <Select
                value={filters[dim.id]}
                onChange={v => handleFilterChange(dim, v)}
                style={{ minWidth: 160 }}
                placeholder={`请选择${dim.name}`}
                options={[]}
              />
            )
          } else if (dim.type === 'multiSelect') {
            comp = (
              <Select
                mode="multiple"
                value={filters[dim.id]}
                onChange={v => handleFilterChange(dim, v)}
                style={{ minWidth: 160 }}
                placeholder={`请选择${dim.name}`}
                options={[]}
              />
            )
          } else if (dim.type === 'text') {
            comp = (
              <Input
                value={filters[dim.id]}
                onChange={e => handleFilterChange(dim, e.target.value)}
                style={{ minWidth: 160 }}
                placeholder={`请输入${dim.name}`}
              />
            )
          } else if (dim.type === 'date') {
            const rangeValue: [Dayjs, Dayjs] | null = (Array.isArray(filters[dim.id]) && filters[dim.id].length === 2) ? (filters[dim.id] as [Dayjs, Dayjs]) : null;
            comp = (
              <RangePicker
                value={rangeValue}
                onChange={v => handleFilterChange(dim, v as [Dayjs, Dayjs])}
                style={{ minWidth: 220 }}
              />
            )
          }
          return (
            <div key={dim.id} className="flex flex-col min-w-[160px]">
              <span className="mb-1 text-gray-600 text-sm">{dim.name}</span>
              {comp}
            </div>
          )
        })}
        {/* Apply按钮同行显示，自动换行，右侧对齐 */}
        <div className="flex flex-col min-w-[120px] ml-auto">
          <Button type="primary" onClick={handleApply} loading={loading}>Apply</Button>
        </div>
      </div>
    )
  }

  // ECharts option
  const chartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chartData.map(d => d.date),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: chartData.map(d => d.value),
        type: 'line',
        smooth: true,
        name: metric?.name,
      },
    ],
  }

  // insight表格列
  const insightColumns = [
    { title: '日期', dataIndex: 'name', key: 'name' },
    { title: '指标值', dataIndex: 'value', key: 'value' },
    { title: '排名', dataIndex: 'rank', key: 'rank' },
    { title: '排名百分比', dataIndex: 'percent', key: 'percent' },
  ]

  if (initLoading) {
    return <div className="flex justify-center items-center h-96"><Spin size="large" /></div>
  }
  if (!metric) {
    return <Empty description="未找到该指标" className="my-12" />
  }

  return (
    <div className="p-8 bg-white rounded shadow">
      {/* 顶部标题区 */}
      <Title level={2}>{metric.name}</Title>
      <Paragraph type="secondary">{metric.description}</Paragraph>
      {/* Tabs区 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'analysis', label: 'Analysis', children: (
            <div>
              {/* metadata区 */}
              <Descriptions title="指标元数据" bordered size="small" column={2} className="mb-6">
                <Descriptions.Item label="公式">{metric.dataSource || '-'}</Descriptions.Item>
                <Descriptions.Item label="来源表">{'-'}</Descriptions.Item>
                <Descriptions.Item label="单位">{metric.unit || '-'}</Descriptions.Item>
                <Descriptions.Item label="聚合方式">{metric.aggregation || '-'}</Descriptions.Item>
              </Descriptions>
              {/* filter区 */}
              {renderFilterSection()}
              {/* chart区 */}
              <div className="bg-gray-50 p-4 rounded min-h-[360px] flex items-center justify-center w-full">
                {loading ? <Spin /> : chartData.length > 0 ? <ReactECharts option={chartOption} style={{ width: '100%', height: 360 }} /> : <Empty description="暂无数据" />}
              </div>
            </div>
          ) },
          { key: 'insight', label: 'Insight', children: (
            <div>
              <Table
                columns={insightColumns}
                dataSource={insightData}
                pagination={false}
                bordered
                className="mt-4"
              />
            </div>
          ) },
        ]}
      />
    </div>
  )
}

export default MetricDetailPage 