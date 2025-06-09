import React, { useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from 'antd';
import type { editor } from 'monaco-editor';
import { useMonaco } from '../../hooks/useMonaco';
import { formatSqlBasic } from '../../utils/sqlFormatter';

interface SqlEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
  theme?: 'light' | 'dark';
  onSave?: (value: string) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const SqlEditor: React.FC<SqlEditorProps> = ({
  value = '',
  onChange,
  readOnly = false,
  height = '400px',
  theme = 'light',
  onSave,
  onCancel,
  loading = false,
}) => {
  const { isMonacoReady } = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // 配置编辑器选项
    editor.updateOptions({
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      readOnly,
      automaticLayout: true,
    });

    // 如果是只读模式，隐藏光标
    if (readOnly) {
      editor.updateOptions({
        cursorStyle: 'line-thin',
        cursorBlinking: 'solid',
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!readOnly && onChange) {
      onChange(value);
    }
  };

  const handleSave = () => {
    if (editorRef.current && onSave) {
      const currentValue = editorRef.current.getValue();
      onSave(currentValue);
    }
  };

  const handleFormat = () => {
    if (editorRef.current && !readOnly) {
      const currentValue = editorRef.current.getValue();
      const formattedValue = formatSqlBasic(currentValue);
      editorRef.current.setValue(formattedValue);
      
      // 触发 onChange 事件
      if (onChange) {
        onChange(formattedValue);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border border-gray-200 rounded">
        <Editor
          height={height}
          language="sql"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={theme === 'dark' ? 'vs-dark' : 'vs'}
          loading={<div className="flex items-center justify-center h-full">
            {isMonacoReady ? '编辑器初始化中...' : '加载编辑器中...'}
          </div>}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            cursorStyle: 'line',
            automaticLayout: true,
            glyphMargin: false,
            folding: true,
            lineNumbersMinChars: 4,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
            },
          }}
        />
      </div>
      
      {!readOnly && (onSave || onCancel) && (
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <div>
            <Button onClick={handleFormat} disabled={loading}>
              格式化代码
            </Button>
          </div>
          <div className="space-x-2">
            {onCancel && (
              <Button onClick={onCancel} disabled={loading}>
                取消
              </Button>
            )}
            {onSave && (
              <Button type="primary" onClick={handleSave} loading={loading}>
                保存
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SqlEditor; 