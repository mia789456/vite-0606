import React, { useState } from 'react';
import { Card, Button, Space, Divider } from 'antd';
import { formatSql, formatSqlBasic } from '../utils/sqlFormatter';

const SqlFormatterTest: React.FC = () => {
  const [testSql] = useState(`select u.id,u.username,u.email,count(o.id) as order_count,max(o.created_at) as last_order_date,sum(o.total_amount) as total_spent from users u left join orders o on u.id = o.user_id where u.status = 'active' and u.created_at >= '2024-01-01' group by u.id, u.username, u.email having count(o.id) > 0 order by total_spent desc, last_order_date desc limit 100;`);

  const [formattedSql, setFormattedSql] = useState('');
  const [formattedSqlBasic, setFormattedSqlBasic] = useState('');

  const handleFormat = () => {
    setFormattedSql(formatSql(testSql));
  };

  const handleFormatBasic = () => {
    setFormattedSqlBasic(formatSqlBasic(testSql));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SQL 格式化功能测试</h1>
      
      <Card title="原始 SQL" className="mb-4">
        <pre className="bg-gray-50 p-4 rounded border text-sm overflow-auto">
          {testSql}
        </pre>
      </Card>

      <Space className="mb-4">
        <Button type="primary" onClick={handleFormat}>
          高级格式化
        </Button>
        <Button onClick={handleFormatBasic}>
          基础格式化
        </Button>
      </Space>

      {formattedSql && (
        <Card title="高级格式化结果" className="mb-4">
          <pre className="bg-gray-50 p-4 rounded border text-sm overflow-auto whitespace-pre-wrap">
            {formattedSql}
          </pre>
        </Card>
      )}

      {formattedSqlBasic && (
        <Card title="基础格式化结果" className="mb-4">
          <pre className="bg-gray-50 p-4 rounded border text-sm overflow-auto whitespace-pre-wrap">
            {formattedSqlBasic}
          </pre>
        </Card>
      )}

      <Divider />

      <Card title="格式化功能说明" size="small">
        <div className="space-y-2 text-sm">
          <p><strong>基础格式化功能：</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>关键词前换行</li>
            <li>关键词转换为大写</li>
            <li>逗号后换行并缩进</li>
            <li>AND/OR 条件换行缩进</li>
          </ul>
          
          <p className="mt-4"><strong>高级格式化功能：</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>完整的缩进处理</li>
            <li>括号处理</li>
            <li>更复杂的关键词识别</li>
            <li>多查询语句分隔</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default SqlFormatterTest; 