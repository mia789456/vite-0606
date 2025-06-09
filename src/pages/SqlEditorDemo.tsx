import React, { useState } from 'react';
import { Button, Card, Space, message, Divider } from 'antd';
import { EditOutlined, EyeOutlined, CodeOutlined } from '@ant-design/icons';
import { SqlEditorModal, AdvancedSqlEditor } from '../components/sql-editor';

const SqlEditorDemo: React.FC = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sqlCode, setSqlCode] = useState(`SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(o.id) as order_count,
    MAX(o.created_at) as last_order_date,
    SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
    AND u.created_at >= '2024-01-01'
GROUP BY u.id, u.username, u.email
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC, last_order_date DESC
LIMIT 100;`);

  // 模拟保存操作
  const handleSave = async (value: string) => {
    setLoading(true);
    try {
      // 这里可以调用 API 保存 SQL 代码
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSqlCode(value);
      message.success('SQL 代码保存成功！');
      setEditModalVisible(false);
    } catch {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditModalVisible(true);
  };

  const openViewModal = () => {
    setViewModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const closeViewModal = () => {
    setViewModalVisible(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">SQL 编辑器演示</h1>
        <p className="text-gray-600">
          演示 SQL 编辑器的编辑和查看功能，支持语法高亮、自动提示等功能。
        </p>
      </div>

      <Card title="功能演示" className="mb-6">
        <Space size="large">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={openEditModal}
            size="large"
          >
            编辑 SQL 代码
          </Button>
          
          <Button 
            icon={<EyeOutlined />} 
            onClick={openViewModal}
            size="large"
          >
            查看 SQL 代码
          </Button>
        </Space>

        <Divider />

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <CodeOutlined className="mr-2" />
            当前 SQL 代码预览：
          </h3>
          <pre className="bg-gray-50 p-4 rounded border text-sm overflow-auto max-h-64">
            {sqlCode}
          </pre>
        </div>
      </Card>

      <Card title="高级编辑器演示" className="mb-6">
        <p className="mb-4 text-gray-600">
          高级编辑器支持主题切换、全屏编辑、文件下载等更多功能：
        </p>
        <div style={{ height: '300px' }}>
          <AdvancedSqlEditor
            value={sqlCode}
            onChange={setSqlCode}
            showToolbar={true}
            allowFullscreen={true}
            allowDownload={true}
          />
        </div>
      </Card>

      <Card title="功能特性" size="small">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">编辑模式特性：</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• SQL 语法高亮</li>
              <li>• 关键词自动提示</li>
              <li>• 代码格式化</li>
              <li>• 行号显示</li>
              <li>• 保存和取消操作</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">查看模式特性：</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 只读模式</li>
              <li>• 语法高亮保持</li>
              <li>• 滚动查看</li>
              <li>• 复制功能</li>
              <li>• 响应式布局</li>
            </ul>
          </div>
        </div>
        
        <Divider />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">高级功能特性：</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 主题切换（亮色/暗色）</li>
              <li>• 全屏编辑模式</li>
              <li>• SQL 文件下载</li>
              <li>• 快捷键支持</li>
              <li>• 工具栏控制</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">体积优化：</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 按需引入 Monaco 功能</li>
              <li>• 仅加载 SQL 语言支持</li>
              <li>• 自定义关键词提示</li>
              <li>• 精简编辑器配置</li>
              <li>• 优化加载性能</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 编辑模态框 */}
      <SqlEditorModal
        visible={editModalVisible}
        onCancel={closeEditModal}
        onSave={handleSave}
        title="编辑 SQL 代码"
        initialValue={sqlCode}
        readOnly={false}
        width={900}
        height="500px"
        loading={loading}
      />

      {/* 查看模态框 */}
      <SqlEditorModal
        visible={viewModalVisible}
        onCancel={closeViewModal}
        title="查看 SQL 代码"
        initialValue={sqlCode}
        readOnly={true}
        width={900}
        height="500px"
      />
    </div>
  );
};

export default SqlEditorDemo; 