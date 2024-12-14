import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

const TaskInfoModal = ({ visible, onCancel, task, users }) => {
  const assignedUsers = task.assigned_users?.map(userId => {
    const user = users.find(user => user.id === userId);
    return user ? user.fio : userId;
  }).join(', ');

  return (
    <Modal
      title="Task Information"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Title">{task.title}</Descriptions.Item>
        <Descriptions.Item label="Status">
            <Tag color={task.status === 'created' ? 'blue' : task.status === 'in progress' ? 'orange' : 'green'}>
                {task.status}
            </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Description">{task.description}</Descriptions.Item>
        <Descriptions.Item label="Assigned Users">{assignedUsers}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TaskInfoModal;
