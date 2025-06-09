import React from 'react';
import Editor from '@monaco-editor/react';
import monaco from '../monacoLoader';

interface SQLEditorProps {
  value: string;
  isEditable: boolean;
  onEdit?: (value: string) => void;
}

const SQLEditor: React.FC<SQLEditorProps> = ({ value, isEditable, onEdit }) => {
  return (
    <Editor
      height="500px"
      language="sql"
      theme="vs-dark"
      value={value}
      options={{
        readOnly: !isEditable,
        minimap: { enabled: false },
        automaticLayout: true,
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showVariables: true,
        },
      }}
      onChange={onEdit}
      editorDidMount={(editor, monaco) => {
        // 可以在这里添加更多的编辑器配置
      }}
    />
  );
};

export default SQLEditor;