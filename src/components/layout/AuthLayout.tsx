import React from 'react'
import { Layout, Card } from 'antd'

const { Content } = Layout

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">指标平台</h1>
            <p className="text-gray-600">数据驱动决策的专业平台</p>
          </div>
          <Card className="shadow-lg">
            {children}
          </Card>
        </div>
      </Content>
    </Layout>
  )
}

export default AuthLayout 