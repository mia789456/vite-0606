import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import SQLEditor from './SQLEditor';

interface SQLEditorModalProps {
  visible: boolean;
  onCancel: () => void;
  initialSQL: string;
  isEditable: boolean;
  onSave?: (sql: string) => void;
}

const SQLEditorModal: React.FC<SQLEditorModalProps> = ({
  visible,
  onCancel,
  initialSQL,
  isEditable,
  onSave,
}) => {
  const [sql, setSql] = useState(initialSQL);

  const handleSave = () => {
    if (onSave) {
      onSave(sql);
    }
    onCancel();
  };

  return (
    <Modal
      title={isEditable ? '编辑 SQL' : '查看 SQL'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        isEditable && (
          <Button key="save" type="primary" onClick={handleSave}>
            保存
          </Button>
        ),
        <Button key="cancel" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <SQLEditor value={sql} isEditable={isEditable} onEdit={setSql} />
    </Modal>
  );
};

export default SQLEditorModal;