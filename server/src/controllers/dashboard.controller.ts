import { Controller, Get, Param } from '@nestjs/common';
import type { Report } from '../models/dashboard';

@Controller('api/dashboards')
export class DashboardController {
  // 获取报表详情
  @Get(':id')
  getDashboard(@Param('id') id: string): {
    code: number;
    message: string;
    data: Report;
  } {
    // mock数据
    const mockReport: Report = {
      id,
      name: '销售报表',
      description: '月度销售数据分析',
      tabs: [
        {
          id: 'tab1',
          name: '总览',
          filters: [
            {
              id: 'f1',
              name: '区域',
              type: 'singleSelect',
              options: [
                { label: '华东', value: 'east' },
                { label: '华南', value: 'south' },
                { label: '华北', value: 'north' },
              ],
            },
            {
              id: 'f2',
              name: '日期',
              type: 'date',
            },
          ],
          charts: [
            {
              id: 'metric1',
              title: '销售趋势',
              position: { x: 0, y: 0, w: 6, h: 12 },
            },
            {
              id: 'metric2',
              title: '利润趋势',
              position: { x: 6, y: 0, w: 6, h: 12 },
            },
          ],
        },
        {
          id: 'tab2',
          name: '分区域',
          filters: [
            {
              id: 'f1',
              name: '区域',
              type: 'singleSelect',
              options: [
                { label: '华东', value: 'east' },
                { label: '华南', value: 'south' },
                { label: '华北', value: 'north' },
              ],
            },
            {
              id: 'f2',
              name: '日期',
              type: 'date',
            },
          ],
          charts: [
            {
              id: 'metric3',
              title: '区域销售对比',
              position: { x: 0, y: 0, w: 12, h: 12 },
            },
          ],
        },
      ],
    };
    return {
      code: 200,
      message: 'success',
      data: mockReport,
    };
  }
}
