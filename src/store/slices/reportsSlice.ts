import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { reportsAPI } from '../../services/api'

export interface Report {
  id: string
  name: string
  creationTime: string
  metricsCount: number
}

export interface ReportsState {
  list: Report[]
  isLoading: boolean
  error: string | null
}

const initialState: ReportsState = {
  list: [],
  isLoading: false,
  error: null,
}

// 异步thunk actions
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.getReports()
      return response.data
    } catch (error) {
      return rejectWithValue('获取报表列表失败')
    }
  }
)

export const createReport = createAsyncThunk(
  'reports/createReport',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.createReport(name)
      return response.data
    } catch (error) {
      return rejectWithValue('创建报表失败')
    }
  }
)

export const addMetricToReport = createAsyncThunk(
  'reports/addMetricToReport',
  async ({ reportId, metricId }: { reportId: string; metricId: string }, { rejectWithValue }) => {
    try {
      await reportsAPI.addMetricToReport(reportId, metricId)
      return { reportId, metricId }
    } catch (error) {
      return rejectWithValue('添加指标到报表失败')
    }
  }
)

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reports
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false
        state.list = action.payload
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create report
      .addCase(createReport.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.isLoading = false
        state.list.push(action.payload)
      })
      .addCase(createReport.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add metric to report
      .addCase(addMetricToReport.fulfilled, (state, action) => {
        const report = state.list.find(r => r.id === action.payload.reportId)
        if (report) {
          report.metricsCount += 1
        }
      })
  },
})

export const { clearError } = reportsSlice.actions
export default reportsSlice.reducer 