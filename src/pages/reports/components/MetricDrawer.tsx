import React from 'react';
import { Drawer, Spin, Button } from 'antd';
import { Metric } from '@/services/api';

interface MetricDrawerProps {
  open: boolean;
  loading: boolean;
  metrics: Metric[];
  onClose: () => void;
  onAddMetric: (metric: Metric) => void;
}

const MetricDrawer: React.FC<MetricDrawerProps> = ({ open, loading, metrics, onClose, onAddMetric }) => {
  return (
    <Drawer
      title="选择要添加的指标"
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
    >
      {loading ? <Spin /> : (
        <div>
          {metrics.length === 0 ? <div className="text-gray-400">暂无可用指标</div> : (
            <ul>
              {metrics.map(metric => (
                <li key={metric.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">{metric.name}</div>
                    <div className="text-xs text-gray-500">{metric.description}</div>
                  </div>
                  <Button size="small" type="primary" onClick={() => onAddMetric(metric)}>添加</Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Drawer>
  );
};

export default MetricDrawer; 