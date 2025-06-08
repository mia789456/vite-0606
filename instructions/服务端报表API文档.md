# 报表相关API接口设计文档（NestJS，Mock数据，规范版）

## 1. API接口前缀
所有接口统一前缀：
```
http://localhost:3000/api
```

## 2. 接口返回格式
- Content-Type: application/json
- 所有接口返回统一格式：
  - 正常：
    ```json
    { "code": 200, "message": "success", "data": any }
    ```
  - 错误：
    ```json
    { "code": 500, "message": "错误描述", "data": null, "error": any }
    ```

---

## 3. 报表相关接口

### 3.1 获取报表详情
- **接口路径**：`GET /api/dashboards/:id`
- **请求方式**：GET
- **请求参数**：
  - `id`（路径参数）：报表ID
- **返回数据**：
  - 类型：`Report`
  - 返回格式：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": {
        "id": "r1",
        "name": "销售报表",
        "description": "月度销售数据分析",
        "tabs": [
          {
            "id": "tab1",
            "name": "总览",
            "filters": [
              { "id": "f1", "name": "区域", "type": "singleSelect", "options": [ { "label": "华东", "value": "east" } ] },
              { "id": "f2", "name": "日期", "type": "date" }
            ],
            "charts": [
              {
                "id": "c1",
                "title": "销售趋势",
                "position": { "x": 0, "y": 0, "w": 6, "h": 12 }
              }
            ]
          }
        ]
      }
    }
    ```
- **TypeScript类型定义**（见`server/src/models/dashboard.ts`）：
```ts
export type DimensionType = 'singleSelect' | 'multiSelect' | 'text' | 'date';

export interface ReportFilter {
  id: string;
  name: string;
  type: DimensionType;
  options?: Array<{ label: string; value: string }>;
}

export interface ReportChart {
  id: string;
  title: string;
  position: {
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
```

---

### 3.2 获取报表Tab下的图表数据（支持筛选）
注意： 这个API在metrics.controller.ts中已经实现过了，我们只需要直接调用即可。
- **接口路径**：`POST /api/metrics/:metricId`
- **请求方式**：POST
- **请求参数**：
  - `dashboardId`（路径参数）：报表ID
  - `metricId`（路径参数）：Metric ID
  - `body`（JSON对象）：各filter的值，类型为`Record<string, any>`
    - key为filter名称（如"区域"、"日期"等）
    - value类型：
      - 单选下拉框：`string`
      - 多选下拉框：`string[]`
      - 文本输入框：`string`
      - 日期区间：`[string, string]`（如["2024-01-01", "2024-01-31"]）
- **返回数据**：
  - 类型：`Array<{ date: string; value: number }>`
  - 返回格式：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": [
        { "date": "2024-01-01", "value": 1234 },
        { "date": "2024-01-02", "value": 1567 }
      ]
    }
    ```

---

### 3.3 获取所有指标（metrics）列表
- **接口路径**：`GET /api/metrics`
- **请求方式**：GET
- **请求参数**：无
- **返回数据**：
  - 类型：`Metric[]`
  - 返回格式：
    ```json
    {
      "code": 200,
      "message": "success",
      "data": [
        {
          "id": "metric1",
          "name": "销售额",
          "description": "月度销售总额指标"
        },
        {
          "id": "metric2",
          "name": "利润",
          "description": "月度利润指标"
        }
      ]
    }
    ```
- **TypeScript类型定义**：
```ts
export interface MetricListItem {
  id: string;
  name: string;
  description: string;
}
```

---

## 4. 其他说明
- 所有接口均可返回mock数据，便于前端开发联调。
- 推荐将类型定义单独放在`server/src/models/dashboard.ts`，并在controller/service中import使用，保证类型一致性。
- 错误返回格式建议：
  ```json
  { "code": 500, "message": "错误描述", "data": null, "error": "Bad Request" }
  ```
