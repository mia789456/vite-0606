import React from 'react'
import { Typography } from 'antd'

const { Title } = Typography

const ReportsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>报表中心</Title>
      <p>这里将显示报表列表</p>
    </div>
  )
}

export default ReportsPage 