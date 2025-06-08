// 报表页面 TypeScript 类型定义

export type DimensionType = 'singleSelect' | 'multiSelect' | 'text' | 'date';

export interface ReportFilter {
  id: string;
  name: string;
  type: DimensionType;
  options?: Array<{ label: string; value: string }>; // 下拉选项，单/多选时有
}

export interface ReportChart {
  id: string; // 这其实是指标的id，我们可以通过tabid加指标id唯一确定一个chart
  title: string;
  position: {
    // 布局位置
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface ReportTab {
  id: string;
  name: string;
  filters: ReportFilter[];
  charts: ReportChart[];
}

export interface Report {
  id: string;
  name: string;
  description?: string;
  tabs: ReportTab[];
}
