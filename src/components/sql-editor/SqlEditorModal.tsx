import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import SqlEditor from './SqlEditor';

interface SqlEditorModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave?: (value: string) => void;
  title?: string;
  initialValue?: string;
  readOnly?: boolean;
  width?: number;
  height?: string;
  theme?: 'light' | 'dark';
  loading?: boolean;
}

const SqlEditorModal: React.FC<SqlEditorModalProps> = ({
  visible,
  onCancel,
  onSave,
  title,
  initialValue = '',
  readOnly = false,
  width = 800,
  height = '500px',
  theme = 'light',
  loading = false,
}) => {
  const [sqlValue, setSqlValue] = useState(initialValue);

  useEffect(() => {
    if (visible) {
      setSqlValue(initialValue);
    }
  }, [visible, initialValue]);

  const handleSave = (value: string) => {
    if (onSave) {
      onSave(value);
    }
  };

  const handleCancel = () => {
    setSqlValue(initialValue);
    onCancel();
  };

  const handleChange = (value: string | undefined) => {
    setSqlValue(value || '');
  };

  return (
    <Modal
      title={title || (readOnly ? 'SQL 代码查看' : 'SQL 代码编辑')}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={width}
      style={{ top: 20 }}
      destroyOnClose
      maskClosable={false}
    >
      <div style={{ height: height }}>
        <SqlEditor
          value={sqlValue}
          onChange={handleChange}
          readOnly={readOnly}
          height="100%"
          theme={theme}
          onSave={readOnly ? undefined : handleSave}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default SqlEditorModal; 