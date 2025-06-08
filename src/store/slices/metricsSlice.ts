import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { metricsAPI } from '../../services/api'

export type DimensionType = 'text' | 'singleSelect' | 'date' | 'multiSelect';

export interface Dimension {
  id: string;
  name: string;
  type: DimensionType;
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

export interface MetricsState {
  list: Metric[]
  currentMetric: Metric | null
  metricData: Array<{ date: string; value: number }>
  isLoading: boolean
  error: string | null
  total: number
  page: number
  pageSize: number
  searchKeyword: string
}

const initialState: MetricsState = {
  list: [],
  currentMetric: null,
  metricData: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
  searchKeyword: '',
}

// 异步thunk actions
export const fetchMetrics = createAsyncThunk(
  'metrics/fetchMetrics',
  async (params?: { page?: number; pageSize?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await metricsAPI.getMetrics(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取指标列表失败')
    }
  }
)

export const fetchMetric = createAsyncThunk(
  'metrics/fetchMetric',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await metricsAPI.getMetric(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取指标详情失败')
    }
  }
)

export const createMetric = createAsyncThunk(
  'metrics/createMetric',
  async (data: Omit<Metric, 'id' | 'creator' | 'creationTime'>, { rejectWithValue }) => {
    try {
      const response = await metricsAPI.createMetric(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '创建指标失败')
    }
  }
)

export const updateMetric = createAsyncThunk(
  'metrics/updateMetric',
  async ({ id, data }: { id: string; data: Partial<Metric> }, { rejectWithValue }) => {
    try {
      const response = await metricsAPI.updateMetric(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '更新指标失败')
    }
  }
)

export const deleteMetric = createAsyncThunk(
  'metrics/deleteMetric',
  async (id: string, { rejectWithValue }) => {
    try {
      await metricsAPI.deleteMetric(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '删除指标失败')
    }
  }
)

export const fetchMetricData = createAsyncThunk(
  'metrics/fetchMetricData',
  async ({ id, params }: { id: string; params?: any }, { rejectWithValue }) => {
    try {
      const response = await metricsAPI.getMetricData(id, params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || '获取指标数据失败')
    }
  }
)

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload
    },
    clearCurrentMetric: (state) => {
      state.currentMetric = null
    },
    clearMetricData: (state) => {
      state.metricData = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch metrics
      .addCase(fetchMetrics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMetrics.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload.list
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.pageSize
      })
      .addCase(fetchMetrics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch metric
      .addCase(fetchMetric.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMetric.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentMetric = action.payload
      })
      .addCase(fetchMetric.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create metric
      .addCase(createMetric.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createMetric.fulfilled, (state, action) => {
        state.isLoading = false
        state.list.push(action.payload)
      })
      .addCase(createMetric.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update metric
      .addCase(updateMetric.fulfilled, (state, action) => {
        const index = state.list.findIndex(m => m.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
        if (state.currentMetric?.id === action.payload.id) {
          state.currentMetric = action.payload
        }
      })
      // Delete metric
      .addCase(deleteMetric.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id !== action.payload)
      })
      // Fetch metric data
      .addCase(fetchMetricData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMetricData.fulfilled, (state, action) => {
        state.isLoading = false
        state.metricData = action.payload
      })
      .addCase(fetchMetricData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const {
  clearError,
  setSearchKeyword,
  setPage,
  setPageSize,
  clearCurrentMetric,
  clearMetricData,
} = metricsSlice.actions

export default metricsSlice.reducer 