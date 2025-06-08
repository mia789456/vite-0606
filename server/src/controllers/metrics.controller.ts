import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Metric, MetricData } from '../models/metric';

@Controller('api/metrics')
export class MetricsController {
  // GET /api/metrics
  @Get()
  getMetrics() {
    // mock数据
    const metrics = [
      { id: 'metric1', name: '销售额', description: '月度销售总额指标' },
      { id: 'metric2', name: '利润', description: '月度利润指标' },
      { id: 'metric3', name: '订单量', description: '月度订单量指标' },
    ];
    return {
      code: 200,
      message: 'success',
      data: metrics,
    };
  }

  // GET /api/metrics/:id
  @Get(':id')
  getMetric(@Param('id') id: string) {
    const metric: Metric = {
      id,
      name: '销售额',
      description: '月度销售总额指标',
      creator: 'admin',
      creationTime: '2024-01-01',
      dataSource: 'SELECT SUM(amount) as value FROM sales WHERE date >= ? AND date <= ?',
      dimensions: [
        { id: '1', name: '区域', type: 'singleSelect' },
        { id: '2', name: '产品类别', type: 'text' },
        { id: '3', name: 'Vertical', type: 'multiSelect' },
        { id: '4', name: '日期', type: 'date' },
        { id: '5', name: 'Site', type: 'multiSelect' },
        { id: '6', name: 'Country', type: 'multiSelect' },
        { id: '7', name: 'Device', type: 'multiSelect' },
      ],
      unit: '元',
      aggregation: 'Sum',
    };
    return {
      code: 200,
      message: 'success',
      data: metric,
    };
  }

  // POST /api/metrics/:id/data
  @Post(':id/data')
  getMetricData(
    @Param('id') _id: string,
    @Body() _filters: Record<string, any>,
  ) {
    // mock 30天数据
    const data: MetricData[] = Array.from({ length: 30 }).map((_, i) => {
      const date = new Date(2024, 0, 1 + i).toISOString().split('T')[0];
      return {
        date,
        value: Math.floor(Math.random() * 10000) + 5000,
      };
    });
    return {
      code: 200,
      message: 'success',
      data,
    };
  }
} 