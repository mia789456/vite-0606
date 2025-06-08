import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { store } from './store'
import AuthLayout from './components/layout/AuthLayout'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import MetricsListPage from './pages/metrics/MetricsListPage'
import MetricDetailPage from './pages/metrics/MetricDetailPage'
import MetricFormPage from './pages/metrics/MetricFormPage'
import ReportsPage from './pages/reports/ReportsPage'
import ReportViewPage from './pages/reports/ReportViewPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import './styles/globals.css'
import CuteLogin from './components/CuteLogin'
import ReportEditPage from './pages/reports/ReportEditPage'
import ContextDemo from './pages/ContextDemo'

import { useState } from 'react';
import { createRoot } from 'react-dom/client';

import { createContext, useContextSelector } from 'use-context-selector';

const context = createContext(null);

const Counter1 = () => {
  console.log('counter1 render')
  const count1 = useContextSelector(context, (v) => v[0].count1);
  const setState = useContextSelector(context, (v) => v[1]);
  const increment = () =>
    setState((s) => ({
      ...s,
      count1: s.count1 + 1,
    }));
  return (
    <div>
      <span>Count1: {count1}</span>
      <button type="button" onClick={increment}>
        +1
      </button>
      {Math.random()}
      <Count3 />
    </div>
  );
};

const Counter2 = () => {
  console.log('counter2 render')
  const count2 = useContextSelector(context, (v) => v[0].count2);
  const setState = useContextSelector(context, (v) => v[1]);
  const increment = () =>
    setState((s) => ({
      ...s,
      count2: s.count2 + 1,
    }));
  return (
    <div>
      <span>Count2: {count2}</span>
      <button type="button" onClick={increment}>
        +1
      </button>
      {Math.random()}
      
    </div>
  );
};

const Count3 = () => {
  console.log('count3 render')
  return <>i am count3</>
}

const StateProvider = ({ children }) => (
  <context.Provider value={useState({ count1: 0, count2: 0 })}>
    {children}
  </context.Provider>
);





function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <Routes>
            {/* 认证相关路由 */}
            <Route path="/login" element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            } />
            <Route path="/register" element={
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            } />
            
            {/* 主应用路由 - 需要认证 */}
            {/* <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/metrics" replace />} />
              <Route path="metrics" element={<MetricsListPage />} />
              <Route path="metrics/new" element={<MetricFormPage />} />
              <Route path="metrics/:id" element={<MetricDetailPage />} />
              <Route path="metrics/:id/edit" element={<MetricFormPage />} />
              
              <Route path="reports" element={<ReportsPage />} />
              <Route path="reports/:dashboardId" element={<ReportViewPage />} />
              <Route path="reports/:dashboardId/edit" element={<ReportEditPage />} />
              <Route path="demo" element={<CuteLogin />} />
            </Route> */}
            
            {/* 保留原有的演示页面 */}
            <Route path="/tree" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<div>Domain Tree Page - To be implemented</div>} />
            </Route>
            
            <Route path="/buttons" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
            </Route>

            <Route path="/demo" element={<ContextDemo />}>
            </Route>
            
            {/* 404页面 */}
            <Route path="*" element={<Navigate to="/metrics" replace />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </Provider>
  )
}

function App1() {
  return <ContextDemo />
}

const App3 = () => (
  <StateProvider>
    <Counter1 />
    <Counter2 />
  </StateProvider>
);

export default App3


