import React, { useEffect, useState } from 'react';
import { Tree, Card, Modal, Select, Button, message, Input } from 'antd';
import Pocketbase from 'pocketbase';

const { TreeNode } = Tree;

const EnterpriseStructure = () => {
  const pb = new Pocketbase('http://127.0.0.1:8090');
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateDepartmentModalVisible, setIsCreateDepartmentModalVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  const fetchDepartments = async () => {
    const records = await pb.collection('Department').getFullList();
    setDepartments(records);
  };

  const fetchUsers = async () => {
    const records = await pb.collection('users').getFullList({
        filter: `position != 'director'`
    });
    setUsers(records);
  };

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const showModal = (department) => {
    setSelectedDepartment(department);
    setIsModalVisible(true);
  };

  const showCreateDepartmentModal = () => {
    setIsCreateDepartmentModalVisible(true);
  };

  const handleOk = async () => {
    const updatePromises = selectedUserIds.map(userId => {
      return pb.collection('users').update(userId, { department_id: selectedDepartment.id });
    });

    await Promise.all(updatePromises);
    message.success('Сотрудники успешно добавлены в отдел');
    setIsModalVisible(false);
    setSelectedUserIds([]);
    await fetchUsers(); // Обновление данных пользователей
  };

  const handleCreateDepartmentOk = async () => {
    await pb.collection('Department').create({ name: newDepartmentName });
    message.success('Отдел успешно создан');
    setIsCreateDepartmentModalVisible(false);
    setNewDepartmentName('');
    await fetchDepartments(); // Обновление данных отделов
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUserIds([]);
  };

  const handleCreateDepartmentCancel = () => {
    setIsCreateDepartmentModalVisible(false);
    setNewDepartmentName('');
  };

  const handleUserSelect = (userIds) => {
    setSelectedUserIds(userIds);
  };

  const handleNewDepartmentNameChange = (e) => {
    setNewDepartmentName(e.target.value);
  };

  const handlePromoteToHead = async (userId, departmentId) => {
    const currentHead = users.find(user => user.department_id === departmentId && user.position === 'head');
    if (currentHead) {
      await pb.collection('users').update(currentHead.id, { position: 'worker' });
    }

    await pb.collection('users').update(userId, { position: 'head' });
    message.success('Руководитель отдела успешно назначен');
    await fetchUsers(); // Обновление данных пользователей
  };

  const renderTreeNodes = (data) => {
    return data.map((department) => (
      <TreeNode
        title={
          <div>
            {department.name}
            <Button type="link" onClick={() => showModal(department)}>
              Добавить сотрудников
            </Button>
          </div>
        }
        key={department.id}
      >
        {users
          .filter((user) => user.department_id === department.id)
          .map((user) => (
            <TreeNode
              title={
                <div>
                  {user.fio} ({user.position})
                  {user.position !== 'head' && (
                    <Button type="link" onClick={() => handlePromoteToHead(user.id, department.id)}>
                      Назначить руководителем
                    </Button>
                  )}
                </div>
              }
              key={user.id}
            />
          ))}
      </TreeNode>
    ));
  };

  const availableUsers = users.filter((user) => !user.department_id);

  return (
    <Card title="Структура предприятия" style={{ width: '100%', marginTop: '60px' }}>
      <Button type="primary" onClick={showCreateDepartmentModal} style={{ marginBottom: '20px' }}>
        Создать новый отдел
      </Button>
      <Tree showLine>{renderTreeNodes(departments)}</Tree>
      <Card title="Сотрудники без отдела" style={{ marginTop: '20px' }}>
        {availableUsers.map((user) => (
          <div key={user.id}>{user.fio}</div>
        ))}
      </Card>
      <Modal
        title={`Добавить сотрудников в отдел: ${selectedDepartment?.name}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Выберите сотрудников"
          onChange={handleUserSelect}
        >
          {availableUsers.map((user) => (
            <Select.Option key={user.id} value={user.id}>
              {user.fio}
            </Select.Option>
          ))}
        </Select>
      </Modal>
      <Modal
        title="Создать новый отдел"
        visible={isCreateDepartmentModalVisible}
        onOk={handleCreateDepartmentOk}
        onCancel={handleCreateDepartmentCancel}
      >
        <Input
          placeholder="Название отдела"
          value={newDepartmentName}
          onChange={handleNewDepartmentNameChange}
        />
      </Modal>
    </Card>
  );
};

export default EnterpriseStructure;