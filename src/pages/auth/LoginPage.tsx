import React, { useEffect } from 'react'
import { Form, Input, Button, Alert, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError } from '../../store/slices/authSlice'
import { RootState, AppDispatch } from '../../store'

const { Text } = Typography

interface LoginForm {
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const { isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  const from = (location.state as any)?.from?.pathname || '/metrics'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const onFinish = async (values: LoginForm) => {
    try {
      await dispatch(loginUser(values)).unwrap()
    } catch (error) {
      // 错误处理在slice中进行
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">登录</h2>
        <Text type="secondary">登录您的账户以访问指标平台</Text>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearError())}
          className="mb-4"
        />
      )}

      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        autoComplete="off"
        size="large"
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: 'email', message: '请输入有效的邮箱地址!' }
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入邮箱"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="w-full"
          >
            登录
          </Button>
        </Form.Item>
      </Form>

      <div className="text-center">
        <Text type="secondary">
          还没有账户？
          <Link to="/register" className="ml-1 text-blue-600 hover:text-blue-700">
            立即注册
          </Link>
        </Text>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <Text type="secondary" className="text-sm">
          <strong>演示账户：</strong><br />
          邮箱：admin@example.com<br />
          密码：password
        </Text>
      </div>
    </div>
  )
}

export default LoginPage 