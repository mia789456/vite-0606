import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import metricsSlice from './slices/metricsSlice';
import reportsSlice from './slices/reportsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    metrics: metricsSlice,
    reports: reportsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 