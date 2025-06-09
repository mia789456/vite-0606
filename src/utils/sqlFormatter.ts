/**
 * SQL 格式化工具
 * 提供基本的 SQL 代码格式化功能
 */

interface FormatOptions {
  indentSize?: number;
  reservedWordCase?: 'upper' | 'lower';
  linesBetweenQueries?: number;
}

export const formatSql = (sql: string, options: FormatOptions = {}): string => {
  const {
    indentSize = 2,
    reservedWordCase = 'upper'
  } = options;

  if (!sql || typeof sql !== 'string') {
    return '';
  }

  // SQL 关键词列表
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
    'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS',
    'NULL', 'TRUE', 'FALSE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'DROP',
    'ALTER', 'TABLE', 'DATABASE', 'INDEX', 'VIEW', 'PROCEDURE', 'FUNCTION',
    'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT', 'UNIQUE',
    'CHECK', 'DEFAULT', 'AUTO_INCREMENT', 'GROUP', 'BY', 'HAVING',
    'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'UNION', 'INTERSECT',
    'EXCEPT', 'ALL', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'FIRST', 'LAST', 'UPPER', 'LOWER', 'LENGTH', 'SUBSTR', 'CONCAT',
    'TRIM', 'REPLACE', 'NOW', 'CURDATE', 'CURTIME', 'DATE', 'TIME',
    'YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND'
  ];

  let formatted = sql;

  // 移除多余的空白字符
  formatted = formatted.replace(/\s+/g, ' ').trim();

  // 处理关键词大小写
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const replacement = reservedWordCase === 'upper' ? keyword.toUpperCase() : keyword.toLowerCase();
    formatted = formatted.replace(regex, replacement);
  });

  // 在主要关键词前添加换行
  const majorKeywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 
                         'RIGHT JOIN', 'FULL JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 
                         'LIMIT', 'UNION', 'INSERT', 'UPDATE', 'DELETE'];
  
  majorKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const replacement = reservedWordCase === 'upper' ? keyword.toUpperCase() : keyword.toLowerCase();
    formatted = formatted.replace(regex, `\n${replacement}`);
  });

  // 处理 SELECT 字段列表
  formatted = formatted.replace(/,\s*/g, ',\n' + ' '.repeat(indentSize));

  // 处理 WHERE 条件
  formatted = formatted.replace(/\bAND\b/gi, '\n' + ' '.repeat(indentSize) + 'AND');
  formatted = formatted.replace(/\bOR\b/gi, '\n' + ' '.repeat(indentSize) + 'OR');

  // 处理括号
  formatted = formatted.replace(/\(/g, '(\n' + ' '.repeat(indentSize));
  formatted = formatted.replace(/\)/g, '\n)');

  // 清理多余的换行和空格
  formatted = formatted
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

  // 正确的缩进处理
  let indentLevel = 0;
  const lines = formatted.split('\n');
  const indentedLines = lines.map(line => {
    const trimmed = line.trim();
    
    // 减少缩进的情况
    if (trimmed.endsWith(')') || trimmed.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmed;
    
    // 增加缩进的情况
    if (trimmed.endsWith('(') || 
        /^(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|GROUP BY|HAVING|ORDER BY)$/i.test(trimmed)) {
      indentLevel++;
    }
    
    return indentedLine;
  });

  // 最终清理
  formatted = indentedLines.join('\n');
  
  // 处理分号后的换行
  formatted = formatted.replace(/;\s*/g, ';\n\n');
  
  // 移除开头和结尾的空行
  formatted = formatted.trim();

  return formatted;
};

// 简化版格式化器（处理基本的缩进和换行）
export const formatSqlBasic = (sql: string): string => {
  if (!sql || typeof sql !== 'string') {
    return '';
  }

  let formatted = sql;
  
  // 基本清理 - 移除多余空白，但保留单个空格
  formatted = formatted.replace(/\s+/g, ' ').trim();
  
  // 关键词转大写
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER',
    'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'OFFSET', 'UNION', 'INSERT', 'INTO',
    'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE',
    'AND', 'OR', 'NOT', 'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'AS', 'ON', 'DISTINCT', 'ALL'
  ];
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    formatted = formatted.replace(regex, keyword.toUpperCase());
  });
  
  // 在主要关键词前添加换行
  const lineBreakKeywords = ['SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 
                             'JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'UNION'];
  
  lineBreakKeywords.forEach(keyword => {
    const regex = new RegExp(`\\s+${keyword}\\s+`, 'gi');
    formatted = formatted.replace(regex, `\n${keyword.toUpperCase()} `);
  });
  
  // 处理 SELECT 后的字段列表 - 逗号后换行缩进
  const selectMatch = formatted.match(/SELECT\s+(.+?)\s+FROM/is);
  if (selectMatch) {
    const fields = selectMatch[1];
    const formattedFields = fields.replace(/,\s*/g, ',\n  ');
    formatted = formatted.replace(selectMatch[0], `SELECT\n  ${formattedFields}\nFROM`);
  }
  
  // 处理 WHERE 条件中的 AND/OR
  formatted = formatted.replace(/\s+(AND|OR)\s+/gi, '\n  $1 ');
  
  // 清理多余的空行
  formatted = formatted.replace(/\n\s*\n/g, '\n').trim();
  
  return formatted;
}; 