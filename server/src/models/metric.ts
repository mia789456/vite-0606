/**
 * 维度的展示类型
 * 1. text 文本
 * 2. singleSelect 单选
 * 3. date 日期
 * 4. multiSelect 多选
 */
export type DimensionType = 'text' | 'singleSelect' | 'date' | 'multiSelect';

export interface Dimension {
  id: string; // 维度ID
  name: string; // 维度名称
  type: DimensionType; // 维度的展示类型
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

export interface MetricData {
  date: string;
  value: number;
}
