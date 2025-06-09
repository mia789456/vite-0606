import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// 按需引入 SQL 语言支持
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';

// 配置 SQL 关键词提示
const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP',
  'ALTER', 'TABLE', 'DATABASE', 'INDEX', 'VIEW', 'TRIGGER', 'PROCEDURE',
  'FUNCTION', 'CONSTRAINT', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'NOT', 'NULL', 'UNIQUE', 'CHECK', 'DEFAULT', 'AUTO_INCREMENT',
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON', 'USING',
  'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
  'UNION', 'INTERSECT', 'EXCEPT', 'ALL', 'DISTINCT', 'AS', 'CASE',
  'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'EXISTS', 'IN', 'BETWEEN',
  'LIKE', 'REGEXP', 'IS', 'AND', 'OR', 'XOR', 'COUNT', 'SUM', 'AVG',
  'MIN', 'MAX', 'FIRST', 'LAST', 'UPPER', 'LOWER', 'LENGTH', 'SUBSTR',
  'CONCAT', 'TRIM', 'REPLACE', 'NOW', 'CURDATE', 'CURTIME', 'DATE',
  'TIME', 'YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND'
];

// 注册自定义的 SQL 完成提供器
monaco.languages.registerCompletionItemProvider('sql', {
  provideCompletionItems: (model, position) => {
    const suggestions = SQL_KEYWORDS.map(keyword => ({
      label: keyword,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: keyword,
      documentation: `SQL keyword: ${keyword}`,
      range: {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: position.column,
        endColumn: position.column,
      },
    }));

    return { suggestions };
  }
});

// 设置 SQL 语言的主题配置
monaco.editor.defineTheme('sql-theme', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword.sql', foreground: '0000FF', fontStyle: 'bold' },
    { token: 'string.sql', foreground: '008000' },
    { token: 'comment.sql', foreground: '808080', fontStyle: 'italic' },
    { token: 'number.sql', foreground: 'FF0000' },
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#000000',
    'editorLineNumber.foreground': '#999999',
    'editor.selectionBackground': '#ADD6FF',
    'editor.inactiveSelectionBackground': '#E5EBF1',
  }
});

export default monaco;