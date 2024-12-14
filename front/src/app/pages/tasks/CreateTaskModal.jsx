import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const CreateTaskModal = ({ visible, onCancel, onOk, users, form }) => {
  return (
    <Modal
      title="Create Task"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} layout="vertical">
      <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            name="assigned_users"
            label="Assigned Users"
            rules={[{ required: true, message: 'Please select users!' }]}
          >
            <Select mode="multiple" placeholder="Select users">
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.fio}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select priority!' }]}
          >
            <Select mode="single" placeholder="Select priority">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
            </Select>
          </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
