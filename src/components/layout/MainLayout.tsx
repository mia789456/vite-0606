import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography } from 'antd'
import {
  BarChartOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { RootState } from '../../store'
import { logoutUser } from '../../store/slices/authSlice'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  const sidebarMenuItems = [
    {
      key: '/metrics',
      icon: <BarChartOutlined />,
      label: '指标管理',
      onClick: () => navigate('/metrics'),
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: '报表中心',
      onClick: () => navigate('/reports'),
    },
  ]

  const getSelectedKeys = () => {
    const path = location.pathname
    if (path.startsWith('/metrics')) return ['/metrics']
    if (path.startsWith('/reports')) return ['/reports']
    return []
  }

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} className="bg-white shadow-sm">
        <div className="p-4">
          <div className="text-center">
            <h2 className={`font-bold text-blue-600 transition-all duration-200 ${
              collapsed ? 'text-lg' : 'text-xl'
            }`}>
              {collapsed ? 'MP' : '指标平台'}
            </h2>
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={sidebarMenuItems}
          className="border-r-0"
        />
      </Sider>
      
      <Layout>
        <Header className="bg-white shadow-sm px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-lg"
            />
          </div>
          
          <div className="flex items-center">
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded">
                <Avatar size="small" icon={<UserOutlined />} />
                <Text className="hidden sm:inline">{user?.username || '用户'}</Text>
              </Space>
            </Dropdown>
          </div>
        </Header>
        
        <Content className="m-6 p-6 bg-white rounded-lg shadow-sm min-h-96">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout 