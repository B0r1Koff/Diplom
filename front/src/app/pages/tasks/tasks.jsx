import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, notification, DatePicker, Progress, Upload } from 'antd';
import { Container, Typography } from '@mui/material';
import axios from 'axios';
import Navbar from '../../2components/navbar/navbar';
import PocketBase from 'pocketbase';
import TaskInfoModal from './TaskInfoModal';
import moment from 'moment';
import { InboxOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Dragger } = Upload;

const TaskPage = () => {
  const KPI = {
    "low": 1,
    "medium": 2,
    "high": 3
  };

  const pb = new PocketBase("http://127.0.0.1:8090");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filteredUser, setFilteredUser] = useState(null);
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('loggedUser')));
  const [fileList, setFileList] = useState([]);

  const fetchData = async () => {
      const usersResponse = await axios.get('http://127.0.0.1:8090/api/collections/users/records');
      setUsers(usersResponse.data.items);

      let filter = '';
      if (filteredUser) {
        filter += `(assigned_users~'${filteredUser}')`;
      }
      if (filteredStatus) {
        if (filter) filter += ' && ';
        filter += `(status='${filteredStatus}')`;
      }

      let sort = '';
      if (sortOrder === 'ascend') {
        sort = 'status';
      } else if (sortOrder === 'descend') {
        sort = '-status';
      }

      if(currentUser?.position !== "worker"){
        const tasksResponse = await pb.collection('Tasks').getList(page, pageSize, {
          filter: filter,
          sort: sort,
        });
        setTasks(tasksResponse.items);
        setTotal(tasksResponse?.totalItems);
      }else{
        const tasksResponse = await axios.get(`http://127.0.0.1:8090/api/collections/Tasks/records?filter=(assigned_users~'${currentUser?.id}')`);
        setTasks(tasksResponse.data.items);
      }
    };

  useEffect(() => {
    fetchData();
  }, [filteredUser, filteredStatus, page, pageSize, sortOrder]);

  useEffect(() => {
    console.log(fileList);
  }, [fileList])

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
    const data = {
      ...values,
      "status": "created",
      "files": null
    };

    const record = pb.collection('Tasks').create(data);

    record?.then(() => {
      notification.success({
        message: 'Успех',
        description: `Задача создана`,
      });
      fetchData();
    }).catch((error) => {
      notification.error({
          message: 'Ошибка',
          description: `Произошла ошибка: ${error.message}`,
        });
    });

    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const filterTasks = (userId) => {
    setFilteredUser(userId);
  };

  const filterTasksByStatus = (status) => {
    setFilteredStatus(status);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setSortOrder(sorter.order);
    setPage(pagination.current);
  };

  const handleStatusChange = async (task, status) => {
    const taskId = task?.id;
    const taskPriority = task?.priority;
    const users = task?.assigned_users;

    await axios.patch(`http://127.0.0.1:8090/api/collections/tasks/records/${taskId}`, { status });
    const tasksResponse = await axios.get('http://127.0.0.1:8090/api/collections/tasks/records');
    setTasks(tasksResponse.data.items);

    if(status === "completed"){
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      for(let i = 0; i < users?.length; i++){
        const userId = users[i];

        const resultList = await pb.collection('KPI').getList(1, 1, {
          filter: `user_id = '${userId}' && month = '${month}' && year = ${year}`,
        });
        
        if(resultList?.items?.length === 0){
          const data = {
            "month": month,
            "year": year,
            "number": KPI?.[taskPriority],
            "user_id": userId
          };

          const record = pb.collection('KPI').create(data);
          record?.then(() => {
            notification.success({
              message: 'Успех',
              description: `Выполнение задачи завершено`,
            });
          }).catch((error) => {
            notification.error({
              message: 'Ошибка',
              description: `Произошла ошибка: ${error.message}`,
            });
          })
        }else{
          const recordId = resultList?.items[0]?.id;
          const kpi = resultList?.items?.[0]?.number;

          const data = {
            "month": month,
            "year": year,
            "number": kpi + KPI?.[taskPriority],
            "user_id": userId
        };

        const record = pb.collection('KPI').update(recordId, data);
        record?.then(() => {
          notification.success({
              message: 'Успех',
              description: `Выполнение задачи завершено`,
            });
          }).catch((error) => {
            notification.error({
              message: 'Ошибка',
              description: `Произошла ошибка: ${error.message}`,
            });
          })
        }
      }
    }
  };

  const handlePriorityChange = async (taskId, priority) => {
    await axios.patch(`http://127.0.0.1:8090/api/collections/tasks/records/${taskId}`, { priority });
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

  const calculateProgress = (startDate, endDate) => {
    const today = moment();
    const start = moment(startDate);
    const end = moment(endDate);
    const totalDuration = end.diff(start, 'days');
    const elapsedDuration = today.diff(start, 'days');
    const progress = Math.min((elapsedDuration / totalDuration) * 100, 100);
    return parseInt(progress);
  };

  const columns = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Статус',
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
                    style={{ width: '100%', height: '100%' }}
                    onChange={(value) => handleStatusChange(record, value)}
                >
                    <Option value="created"><Tag color='blue'>Создана</Tag></Option>
                    <Option value="in progress"><Tag color='orange'>Выполняется</Tag></Option>
                    <Option value="ready for review"><Tag color='purple'>Готова к проверке</Tag></Option>
                    <Option value="reopened"><Tag color='magenta'>Отправлена на доработку</Tag></Option>
                    {/* {!record?.assigned_users?.includes(currentUser?.id) && */}
                      <Option value="completed"><Tag color='green'>Выполнена</Tag></Option>
                    {/* } */}
                </Select>
                :
                <Tag color='green'>Выполнена</Tag>
            }
        </>
      ),
    },
    {
        title: 'Приоритет',
        dataIndex: 'priority',
        key: 'priority',
        sort: true,
        render: (priority, record) => (
          <Select
                    defaultValue={priority}
                    style={{ width: '100%', height: '100%' }}
                    onChange={(value) => handlePriorityChange(record.id, value)}
                >
                    <Option value="low"><Tag color='blue'>Низкий</Tag></Option>
                    <Option value="medium"><Tag color='orange'>Средний</Tag></Option>
                    <Option value="high"><Tag color='red'>Высокий</Tag></Option>
                </Select>
        ),
      },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Назначенные сотрудники',
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
      title: 'Прогресс',
      key: 'progress',
      render: (_, record) => (
        <Progress
          type="circle"
          percent={calculateProgress(record.date_of_start, record.date_of_finish)}
          width={50}
        />
      ),
    },
    {
        title: 'Действия',
        key: 'actions',
        render: (_, record) => (
          <span>
            <Button type="primary" onClick={() => showInfoModal(record)}>Просмотр</Button>
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

   const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <>
    <Container sx={{marginTop: '50px'}}>
      <Typography variant="h4" gutterBottom>
        Задачи
      </Typography>
      {(currentUser?.position === "head" || currentUser?.position === "director") && (
        <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
          Создать задачу
        </Button>
      )}
      <Select
        style={{ width: 200, marginBottom: 16 }}
        placeholder="Фильтр по сотруднику"
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
        placeholder="Фильтр по статусу"
        onChange={filterTasksByStatus}
        allowClear
      >
        <Option value="created"><Tag color='blue'>Создана</Tag></Option>
                    <Option value="in progress"><Tag color='orange'>Выполняется</Tag></Option>
                    <Option value="ready for review"><Tag color='purple'>Готова к проверке</Tag></Option>
                    <Option value="reopened"><Tag color='magenta'>Отправлена на доработку</Tag></Option>
                    <Option value="completed"><Tag color='green'>Выполнена</Tag></Option>
      </Select>
      <Table
        dataSource={tasks}
        columns={columns}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{ current: page, pageSize: pageSize, total: total }}
      />

      <Modal
        title="Создать задачу"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Описание"
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            name="assigned_users"
            label="Назначенные сотрудники"
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
            label="Приоритет"
            rules={[{ required: true, message: 'Please select priority!' }]}
          >
            <Select mode="single" placeholder="Select priority">
                <Option value="low">Низкий</Option>
                <Option value="medium">Средний</Option>
                <Option value="high">Высокий</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date_of_start"
            label="Дата начала"
            rules={[{ required: true, message: 'Please select start date!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="date_of_finish"
            label="Дата завершения"
            rules={[
              { required: true, message: 'Please select end date!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('date_of_start') <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('End date must be after start date!'));
                },
              }),
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="Upload Files">
            <Dragger
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
              </p>
            </Dragger>
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
    </>
  );
};

export default TaskPage;
