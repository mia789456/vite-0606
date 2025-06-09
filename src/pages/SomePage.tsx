import React, { useState } from 'react';
import { Button } from 'antd';
import SQLEditorModal from '../components/SQLEditorModal';

const SomePage: React.FC = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [initialSQL, setInitialSQL] = useState('SELECT * FROM table_name;');

  const handleEditClick = () => {
    setEditModalVisible(true);
  };

  const handleViewClick = () => {
    setViewModalVisible(true);
  };

  const handleSaveSQL = (sql: string) => {
    setInitialSQL(sql);
  };

  return (
    <div>
      <Button onClick={handleEditClick}>编辑 SQL</Button>
      <Button onClick={handleViewClick}>查看 SQL</Button>
      <SQLEditorModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        initialSQL={initialSQL}
        isEditable={true}
        onSave={handleSaveSQL}
      />
      <SQLEditorModal
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        initialSQL={initialSQL}
        isEditable={false}
      />
    </div>
  );
};

export default SomePage;