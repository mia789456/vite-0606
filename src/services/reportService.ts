import axios from 'axios';

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

// 获取报表详情
export async function fetchReport(dashboardId: string) {
  return api.get(`/dashboards/${dashboardId}`);
}

// 获取chart数据（metric数据）
export async function fetchChartData(metricId: string, filters: Record<string, any>) {
  return api.post(`/metrics/${metricId}/data`, filters);
} 


// 报表页面 TypeScript 类型定义

export type DimensionType = 'singleSelect' | 'multiSelect' | 'text' | 'date';

export interface ReportFilter {
  id: string;
  name: string;
  type: DimensionType;
  options?: Array<{ label: string; value: string }>; // 下拉选项，单/多选时有
}

export interface ReportChart {
  id: string; // 这其实是指标的id，我们可以通过tabid加指标id唯一确定一个chart
  title: string;
  position: {
    // 布局位置
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface ReportTab {
  id: string;
  name: string;
  filters: ReportFilter[];
  charts: ReportChart[];
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  tabs: ReportTab[];
}
