# SQL 编辑器组件

基于 Monaco Editor 的 SQL 代码编辑器组件，支持语法高亮、自动提示等功能。

## 组件介绍

### SqlEditor
基础 SQL 编辑器组件

**Props:**
- `value?: string` - 编辑器内容
- `onChange?: (value: string | undefined) => void` - 内容变化回调
- `readOnly?: boolean` - 是否只读模式，默认 false
- `height?: string` - 编辑器高度，默认 '400px'
- `theme?: 'light' | 'dark'` - 主题，默认 'light'
- `onSave?: (value: string) => void` - 保存回调
- `onCancel?: () => void` - 取消回调
- `loading?: boolean` - 是否显示加载状态

### SqlEditorModal
SQL 编辑器模态框组件

**Props:**
- `visible: boolean` - 是否显示模态框
- `onCancel: () => void` - 关闭模态框回调
- `onSave?: (value: string) => void` - 保存回调
- `title?: string` - 模态框标题
- `initialValue?: string` - 初始内容
- `readOnly?: boolean` - 是否只读模式
- `width?: number` - 模态框宽度，默认 800
- `height?: string` - 编辑器高度，默认 '500px'
- `theme?: 'light' | 'dark'` - 主题
- `loading?: boolean` - 是否显示加载状态

## 功能特性

### 编辑模式
- ✅ SQL 语法高亮
- ✅ SQL 关键词自动提示
- ✅ 代码格式化
- ✅ 行号显示
- ✅ 保存和取消操作
- ✅ 自适应布局

### 查看模式
- ✅ 只读显示
- ✅ 语法高亮保持
- ✅ 滚动查看
- ✅ 复制功能

### 体积优化
- ✅ 按需引入 Monaco Editor 功能
- ✅ 仅引入 SQL 语言支持
- ✅ 自定义关键词提示

## 使用示例

### 基础编辑器
```tsx
import { SqlEditor } from '../components/sql-editor';

const MyComponent = () => {
  const [sqlCode, setSqlCode] = useState('SELECT * FROM users;');

  return (
    <SqlEditor
      value={sqlCode}
      onChange={setSqlCode}
      onSave={(value) => console.log('保存:', value)}
      onCancel={() => console.log('取消')}
    />
  );
};
```

### 编辑模态框
```tsx
import { SqlEditorModal } from '../components/sql-editor';

const MyComponent = () => {
  const [visible, setVisible] = useState(false);
  const [sqlCode, setSqlCode] = useState('');

  return (
    <>
      <Button onClick={() => setVisible(true)}>编辑 SQL</Button>
      
      <SqlEditorModal
        visible={visible}
        onCancel={() => setVisible(false)}
        onSave={(value) => {
          setSqlCode(value);
          setVisible(false);
        }}
        initialValue={sqlCode}
        title="编辑 SQL 代码"
      />
    </>
  );
};
```

### 查看模态框
```tsx
<SqlEditorModal
  visible={viewVisible}
  onCancel={() => setViewVisible(false)}
  initialValue={sqlCode}
  readOnly={true}
  title="查看 SQL 代码"
/>
```

## 演示页面

访问 `/sql-editor` 路由查看完整的功能演示。

## 技术实现

- **Monaco Editor**: 微软开源的代码编辑器
- **@monaco-editor/react**: React 封装版本
- **按需引入**: 仅引入 SQL 语言和必要功能
- **自定义提示**: 注册自定义的 SQL 关键词补全
- **Ant Design**: UI 组件库
- **TailwindCSS**: 样式框架 