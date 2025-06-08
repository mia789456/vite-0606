import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // 在实际开发中这里应该是后端API的地址
  timeout: 10000,
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Mock 数据 - 在实际开发中这些应该是真实的API调用
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 通用请求函数
export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

// Domain Tree 相关API
type DomainNode = { title: string; list: string[]; };

export async function getDomainTree(): Promise<{ root: DomainNode; children: DomainNode[] }> {
  return fetcher("/api/domain-tree");
}

// 认证API
export const authAPI = {
  async login(email: string, password: string) {
    await delay(1000) // 模拟网络延迟
    
    // Mock登录验证
    if (email === 'admin@example.com' && password === 'password') {
      return {
        data: {
          user: {
            id: '1',
            username: 'admin',
            email: 'admin@example.com'
          },
          token: 'mock-jwt-token-' + Date.now()
        }
      }
    } else {
      throw {
        response: {
          data: {
            message: '邮箱或密码错误'
          }
        }
      }
    }
  },

  async register(username: string, email: string, password: string) {
    await delay(1000)
    
    // Mock注册
    return {
      data: {
        message: '注册成功，请登录'
      }
    }
  }
}

// 指标API
export const metricsAPI = {
  async getMetrics(params?: { page?: number; pageSize?: number; search?: string }) {
    await delay(800)
    
    const mockMetrics = [
      {
        id: '1',
        name: '销售额',
        description: '月度销售总额指标',
        creator: 'admin',
        creationTime: '2024-01-01',
        dataSource: 'SELECT SUM(amount) as value FROM sales WHERE date >= ? AND date <= ?',
        dimensions: [
          { name: '区域', type: 'text' as const },
          { name: '产品类别', type: 'text' as const },
          { name: '日期', type: 'date' as const }
        ],
        unit: '元',
        aggregation: 'Sum'
      },
      {
        id: '2',
        name: '用户活跃度',
        description: '日活跃用户数量',
        creator: 'admin',
        creationTime: '2024-01-02',
        dataSource: 'SELECT COUNT(DISTINCT user_id) as value FROM user_activities WHERE date = ?',
        dimensions: [
          { name: '平台', type: 'text' as const },
          { name: '日期', type: 'date' as const }
        ],
        unit: '人',
        aggregation: 'Count'
      }
    ]

    const { search = '', page = 1, pageSize = 10 } = params || {}
    let filteredMetrics = mockMetrics
    
    if (search) {
      filteredMetrics = mockMetrics.filter(metric => 
        metric.name.includes(search) || metric.description.includes(search)
      )
    }

    const total = filteredMetrics.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const data = filteredMetrics.slice(start, end)

    return {
      data: {
        list: data,
        total,
        page,
        pageSize
      }
    }
  },

  async getMetric(id: string) {
    try {
      const res = await api.get(`/metrics/${id}`)
      if (res.data.code !== 200) throw new Error(res.data.message)
      return res.data
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message || '获取指标详情失败')
    }
  },

  async createMetric(data: any) {
    await delay(1000)
    return {
      data: {
        id: Date.now().toString(),
        ...data,
        creator: 'admin',
        creationTime: new Date().toISOString().split('T')[0]
      }
    }
  },

  async updateMetric(id: string, data: any) {
    await delay(1000)
    return {
      data: {
        id,
        ...data
      }
    }
  },

  async deleteMetric(id: string) {
    await delay(800)
    return { data: { message: '删除成功' } }
  },

  async getMetricData(id: string, params?: any) {
    try {
      const res = await api.post(`/metrics/${id}/data`, params)
      if (res.data.code !== 200) throw new Error(res.data.message)
      return res.data
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message || '获取指标数据失败')
    }
  }
}

// 报表API
export const reportsAPI = {
  async getReports() {
    await delay(600)
    
    const mockReports = [
      {
        id: '1',
        name: '销售分析报表',
        creationTime: '2024-01-01',
        metricsCount: 3
      },
      {
        id: '2',
        name: '用户行为报表',
        creationTime: '2024-01-02',
        metricsCount: 2
      }
    ]

    return { data: mockReports }
  },

  async createReport(name: string) {
    await delay(800)
    return {
      data: {
        id: Date.now().toString(),
        name,
        creationTime: new Date().toISOString().split('T')[0],
        metricsCount: 0
      }
    }
  },

  async addMetricToReport(reportId: string, metricId: string) {
    await delay(600)
    return { data: { message: '添加成功' } }
  }
}

export default api 


/**
 * 维度的展示类型
 * 1. text 文本
 * 2. singleSelect 单选
 * 3. date 日期
 * 4. multiSelect 多选
 */
export type DimensionType = 'text' | 'singleSelect' | 'date' | 'multiSelect';

export interface Dimension {
  id: string; // 维度ID
  name: string; // 维度名称
  type: DimensionType; // 维度的展示类型
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  creator: string;
  creationTime: string;
  dataSource: string;
  dimensions: Dimension[];
  unit: string;
  aggregation: string;
}

export interface MetricData {
  date: string;
  value: number;
}
