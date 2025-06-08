// 通用API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

// 分页数据类型
export interface PaginationData<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 用户类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Domain Tree 相关类型
export interface DomainNode {
  id: string;
  title: string;
  list: string[];
  children?: DomainNode[];
}

export interface DomainTreeData {
  root: DomainNode;
  children: DomainNode[];
}

// 路由类型
export interface RouteItem {
  path: string;
  label: string;
  icon?: string;
  children?: RouteItem[];
}

// 表单验证错误类型
export interface FormErrors {
  [key: string]: string | undefined;
}

// 加载状态类型
export interface LoadingState {
  loading: boolean;
  error: string | null;
} 