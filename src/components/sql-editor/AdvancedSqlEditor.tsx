import React, { useRef, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button, Space, Tooltip, Switch } from 'antd';
import { 
  FullscreenOutlined, 
  FullscreenExitOutlined, 
  FormatPainterOutlined,
  CopyOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { editor } from 'monaco-editor';
import { useMonaco } from '../../hooks/useMonaco';
import monaco from '../../monacoLoader';

interface AdvancedSqlEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  loading?: boolean;
  showToolbar?: boolean;
  allowFullscreen?: boolean;
  allowDownload?: boolean;
}

const AdvancedSqlEditor: React.FC<AdvancedSqlEditorProps> = ({
  value = '',
  onChange,
  readOnly = false,
  height = '400px',
  onSave,
  onCancel,
  loading = false,
  showToolbar = true,
  allowFullscreen = true,
  allowDownload = true,
}) => {
  const { isMonacoReady } = useMonaco();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      contextmenu: true,
      find: {
        autoFindInSelection: 'never',
        seedSearchStringFromSelection: 'selection'
      }
    });

    // 添加快捷键
    if (!readOnly) {
      // Ctrl+S 保存
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        handleSave();
      });
      
      // Ctrl+Shift+F 格式化
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
        handleFormat();
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
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const handleCopy = async () => {
    if (editorRef.current) {
      const selectedText = editorRef.current.getModel()?.getValueInRange(editorRef.current.getSelection()!);
      const textToCopy = selectedText || editorRef.current.getValue();
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        // 可以添加成功提示
      } catch (err) {
        console.error('复制失败:', err);
      }
    }
  };

  const handleDownload = () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      const blob = new Blob([content], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sql-query-${new Date().getTime()}.sql`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleTheme = (checked: boolean) => {
    setIsDarkTheme(checked);
  };

  const editorHeight = isFullscreen ? '80vh' : height;

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {showToolbar && (
        <div className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-t border">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">主题:</span>
            <Switch
              size="small"
              checked={isDarkTheme}
              onChange={toggleTheme}
              checkedChildren="暗色"
              unCheckedChildren="亮色"
            />
          </div>
          
          <Space size="small">
            {!readOnly && (
              <Tooltip title="格式化 (Ctrl+Shift+F)">
                <Button 
                  size="small" 
                  icon={<FormatPainterOutlined />} 
                  onClick={handleFormat}
                  disabled={loading}
                />
              </Tooltip>
            )}
            
            <Tooltip title="复制">
              <Button 
                size="small" 
                icon={<CopyOutlined />} 
                onClick={handleCopy}
              />
            </Tooltip>
            
            {allowDownload && (
              <Tooltip title="下载 SQL 文件">
                <Button 
                  size="small" 
                  icon={<DownloadOutlined />} 
                  onClick={handleDownload}
                />
              </Tooltip>
            )}
            
            {allowFullscreen && (
              <Tooltip title="全屏切换">
                <Button 
                  size="small" 
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />} 
                  onClick={toggleFullscreen}
                />
              </Tooltip>
            )}
          </Space>
        </div>
      )}
      
      <div className="flex-1 border border-gray-200 rounded">
        <Editor
          height={editorHeight}
          language="sql"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={isDarkTheme ? 'vs-dark' : 'vs'}
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
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
            },
          }}
        />
      </div>
      
      {!readOnly && (onSave || onCancel) && (
        <div className="flex justify-end items-center mt-4 pt-4 border-t space-x-2">
          {onCancel && (
            <Button onClick={onCancel} disabled={loading}>
              取消
            </Button>
          )}
          {onSave && (
            <Tooltip title="保存 (Ctrl+S)">
              <Button type="primary" onClick={handleSave} loading={loading}>
                保存
              </Button>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSqlEditor; 