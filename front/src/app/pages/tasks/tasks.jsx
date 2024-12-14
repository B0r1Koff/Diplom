import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag } from 'antd';
import { Container, Typography } from '@mui/material';
import axios from 'axios';
import Navbar from '../../2components/navbar/navbar';
import PocketBase from 'pocketbase';
import TaskInfoModal from './TaskInfoModal';

const { Option } = Select;
const { TextArea } = Input;

const TaskPage = () => {
    const pb = new PocketBase("http://127.0.0.1:8090");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filteredUser, setFilteredUser] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('loggedUser')));

  useEffect(() => {
    // Загрузите данные пользователей и задач из PocketBase
    const fetchData = async () => {
      const usersResponse = await axios.get('http://127.0.0.1:8090/api/collections/users/records');
      setUsers(usersResponse.data.items);

      if(currentUser?.position !== "worker"){
        const tasksResponse = await axios.get(`http://127.0.0.1:8090/api/collections/Tasks/records`);
        setTasks(tasksResponse.data.items);
      }else{
        const tasksResponse = await axios.get(`http://127.0.0.1:8090/api/collections/Tasks/records?filter=(assigned_users~'${currentUser?.id}')`);
        setTasks(tasksResponse.data.items);
      }
    //   // Предположим, что текущий пользователь хранится в localStorage
    //   const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //   setCurrentUser(currentUser);
    };

    fetchData();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    // Создайте новую задачу в PocketBase
    const record = pb.collection('Tasks').create({
        ...values,
        "status": "created"
    });
    setIsModalVisible(false);
    form.resetFields();
    // Обновите список задач
    const tasksResponse = await axios.get('http://127.0.0.1:8090/api/collections/Tasks/records');
    setTasks(tasksResponse.data.items);
  };

  const filterTasks = (userId) => {
    setFilteredUser(userId);
  };

  const filterTasksByStatus = (status) => {
    setFilteredStatus(status);
  };

  const filteredTasks = tasks.filter(task => {
    const userMatch = !filteredUser || task.assigned_users.includes(filteredUser);
    const statusMatch = !filteredStatus || task.status === filteredStatus;
    return userMatch && statusMatch;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortOrder === 'ascend') {
      return a.status.localeCompare(b.status);
    } else if (sortOrder === 'descend') {
      return b.status.localeCompare(a.status);
    }
    return 0;
  });

  const handleTableChange = (pagination, filters, sorter) => {
    setSortOrder(sorter.order);
  };

  const handleStatusChange = async (taskId, status) => {
    // Обновите статус задачи в PocketBase
    await axios.patch(`http://127.0.0.1:8090/api/collections/tasks/records/${taskId}`, { status });
    // Обновите список задач
    const tasksResponse = await axios.get('http://127.0.0.1:8090/api/collections/tasks/records');
    setTasks(tasksResponse.data.items);
  };

  const showInfoModal = (task) => {
    setSelectedTask(task);
    setIsInfoModalVisible(true);
  };

  const handleInfoCancel = () => {
    setIsInfoModalVisible(false);
    setSelectedTask(null);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      sortOrder: sortOrder,
      render: (status, record) => (
        <>
            {
                status !== 'completed' ?
                <Select
                    defaultValue={status}
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusChange(record.id, value)}
                >
                    <Option value="created"><Tag color='blue'>created</Tag></Option>
                    <Option value="in progress"><Tag color='orange'>in progress</Tag></Option>
                    <Option value="completed"><Tag color='green'>completed</Tag></Option>
                </Select>
                :
                <Tag color='green'>completed</Tag>
            }
        </>
      ),
    },
    {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        sort: true,
        render: (priority) => (
          <Tag color={priority === 'low' ? 'blue' : priority === 'medium' ? 'orange' : 'red'}>
            {priority}
          </Tag>
        ),
      },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Assigned Users',
      dataIndex: 'assigned_users',
      key: 'assigned_users',
      render: (assigned_users) => (
        <span>
          {assigned_users.map(userId => {
            const user = users.find(user => user.id === userId);
            return user ? user.fio : userId;
          }).join(', ')}
        </span>
      ),
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <span>
            <Button type="primary" onClick={() => showInfoModal(record)}>Show Info</Button>
          </span>
        ),
      },
  ];

  const editTask = (task) => {
    // Реализуйте логику редактирования задачи
  };

  const updateStatus = (task) => {
    // Реализуйте логику обновления статуса задачи
  };

  return (
    <Container sx={{marginTop: '10vh'}}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      {(currentUser?.position === "head" || currentUser?.position === "director") && (
        <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
          Create Task
        </Button>
      )}
      <Select
        style={{ width: 200, marginBottom: 16 }}
        placeholder="Filter by user"
        onChange={filterTasks}
        allowClear
      >
        {users.map(user => (
          <Option key={user.id} value={user.id}>
            {user.fio}
          </Option>
        ))}
      </Select>
      <Select
        style={{ width: 200, marginBottom: 16 }}
        placeholder="Filter by status"
        onChange={filterTasksByStatus}
        allowClear
      >
        <Option value="created">Created</Option>
        <Option value="in progress">In Progress</Option>
        <Option value="completed">Completed</Option>
      </Select>
      <Table dataSource={sortedTasks} columns={columns} rowKey="id" onChange={handleTableChange} />

      <Modal
        title="Create Task"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish}>
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

      {selectedTask && (
        <TaskInfoModal
          visible={isInfoModalVisible}
          onCancel={handleInfoCancel}
          task={selectedTask}
          users={users}
        />
      )}
    </Container>
  );
};

export default TaskPage;
