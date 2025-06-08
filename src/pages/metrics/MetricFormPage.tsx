import React from 'react'
import { Typography } from 'antd'

const { Title } = Typography

const MetricFormPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>指标表单</Title>
      <p>这里将显示创建/编辑指标的表单</p>
    </div>
  )
}

export default MetricFormPage 