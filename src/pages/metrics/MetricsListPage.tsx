import React, { useEffect, useState } from 'react'
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Popconfirm, 
  message, 
  Modal,
  Select,
  Typography 
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined,
  FileAddOutlined 
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchMetrics, 
  deleteMetric, 
  setSearchKeyword, 
  setPage, 
  setPageSize 
} from '../../store/slices/metricsSlice'
import { fetchReports, addMetricToReport } from '../../store/slices/reportsSlice'
import type { Metric } from '../../store/slices/metricsSlice'
import type { RootState, AppDispatch } from '../../store'

const { Search } = Input
const { Title } = Typography

const MetricsListPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const [addToReportModal, setAddToReportModal] = useState<{
    visible: boolean
    metricId: string
    metricName: string
  }>({
    visible: false,
    metricId: '',
    metricName: ''
  })
  const [selectedReportId, setSelectedReportId] = useState<string>('')
  const [newReportName, setNewReportName] = useState<string>('')
  
  // 从 Redux store 获取状态
  const { 
    list: metrics, 
    isLoading, 
    total, 
    page, 
    pageSize, 
    searchKeyword 
  } = useSelector((state: RootState) => state.metrics as any)
  
  const { list: reports } = useSelector((state: RootState) => state.reports as any)

  useEffect(() => {
    // 初始化时获取指标列表和报表列表
    dispatch(fetchMetrics({ page, pageSize, search: searchKeyword }))
    dispatch(fetchReports())
  }, [dispatch, page, pageSize, searchKeyword])

  const handleSearch = (value: string) => {
    dispatch(setSearchKeyword(value))
    dispatch(setPage(1))
  }

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteMetric(id)).unwrap()
      message.success('删除成功')
      // 重新获取数据
      dispatch(fetchMetrics({ page, pageSize, search: searchKeyword }))
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleAddToReport = (metricId: string, metricName: string) => {
    setAddToReportModal({
      visible: true,
      metricId,
      metricName
    })
  }

  const handleAddToReportConfirm = async () => {
    try {
      if (selectedReportId) {
        await dispatch(addMetricToReport({ 
          reportId: selectedReportId, 
          metricId: addToReportModal.metricId 
        })).unwrap()
        message.success('已添加到报表')
      }
      
      setAddToReportModal({ visible: false, metricId: '', metricName: '' })
      setSelectedReportId('')
      setNewReportName('')
    } catch (error) {
      message.error('添加失败')
    }
  }

  const columns = [
    {
      title: '指标名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Metric) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/metrics/${record.id}`)}
          className="p-0 h-auto font-medium"
        >
          {text}
        </Button>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'creationTime',
      key: 'creationTime',
      width: 120,
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: Metric) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/metrics/${record.id}`)}
            title="查看详情"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/metrics/${record.id}/edit`)}
            title="编辑"
          />
          <Button
            type="text"
            size="small"
            icon={<FileAddOutlined />}
            onClick={() => handleAddToReport(record.id, record.name)}
            title="添加到报表"
          />
          <Popconfirm
            title="确定要删除这个指标吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">指标管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/metrics/new')}
        >
          注册新指标
        </Button>
      </div>

      <div className="mb-4">
        <Search
          placeholder="搜索指标名称或描述"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          defaultValue={searchKeyword}
          style={{ maxWidth: 400 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={metrics}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          onChange: (page, pageSize) => {
            dispatch(setPage(page))
            if (pageSize) {
              dispatch(setPageSize(pageSize))
            }
          },
        }}
      />

      {/* 添加到报表的Modal */}
      <Modal
        title={`将 "${addToReportModal.metricName}" 添加到报表`}
        open={addToReportModal.visible}
        onOk={handleAddToReportConfirm}
        onCancel={() => {
          setAddToReportModal({ visible: false, metricId: '', metricName: '' })
          setSelectedReportId('')
          setNewReportName('')
        }}
        okText="确定"
        cancelText="取消"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择现有报表
            </label>
            <Select
              style={{ width: '100%' }}
              placeholder="选择报表"
              value={selectedReportId}
              onChange={setSelectedReportId}
              options={reports?.map((report: any) => ({
                value: report.id,
                label: report.name
              }))}
            />
          </div>
          
          <div className="text-center text-gray-500">或</div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              创建新报表
            </label>
            <Input
              placeholder="输入新报表名称"
              value={newReportName}
              onChange={(e) => setNewReportName(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default MetricsListPage 