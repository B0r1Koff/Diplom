import React, { useState } from 'react';
import { Calendar, Modal, InputNumber, Input, Button, Flex, notification } from 'antd';
import moment from 'moment';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import axios from 'axios';
import PocketBase from 'pocketbase';

const TimeTracker = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [notes, setNotes] = useState('');
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('loggedUser')));
  
  const pb = new PocketBase('http://127.0.0.1:8090');

  const showModal = (date) => {
    console.log(date);
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNotes('');
    setHoursWorked(0);
  };

  const handleOk = () => {
    // console.log(`Date: ${selectedDate}, Hours Worked: ${hoursWorked}, Notes: ${notes}`);
    // setIsModalVisible(false);
    const parts = selectedDate.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const records = pb.collection('Reports').getList(1, 1, {
      filter: `month = '${month}' && year = '${year}' && user_id = '${currentUser?.id}'`,
    })
    records.then(({items}) => {
      if(items?.length > 0){
      const params = items[0]?.params;
      const id = items[0]?.id; 
      const updatedParams = {
        ...params,
        [day]: {
          "hours": hoursWorked,
          "description": notes
        }
      };
      const data = {
        "params": updatedParams,
        "user_id": currentUser?.id,
        "year": year,
        "month": month
      };
      const record = pb.collection('Reports').update(id, data);
      record.then(() => {
        handleCancel();
        notification.success({
          message: 'Успех',
          description: 'Данные успешно сохранены!',
        });
      }).catch((error) => {
        notification.error({
          message: 'Ошибка',
          description: `Произошла ошибка: ${error.message}`,
        });
      });
    }
    else{
      const data = {
        "month": month,
        "year": year,
        "params": {
          [day]: {
            "hours": hoursWorked,
            "description": notes
          }
        },
        "user_id": currentUser?.id
      };
      const record = pb.collection('Reports').create(data);
      record.then(() => {
        handleCancel();
        notification.success({
          message: 'Успех',
          description: 'Данные успешно сохранены!',
        });
      }).catch((error) => {
        notification.error({
          message: 'Ошибка',
          description: `Произошла ошибка: ${error.message}`,
        });
      });
    }
  }
  )
    .catch((error) => {
      console?.error(error);
    })
  };

  const dateCellRender = (date) => {
    return (
      <div
        style={{
          height: '10vh',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #d9d9d9',
        }}
      >
        {date.date()}
         <Button type='primary' size='small' onClick={() => showModal(date.format('YYYY-MM-DD'))} style={{ cursor: 'pointer', position: 'absolute', left: '5px', bottom: '5px' }}>
        <Icon path={mdiPencil} size={0.6}/>
      </Button>
      </div>
    );
  };

  return (
    <Flex style={{marginTop: '50px'}}>
      <Calendar fullCellRender={dateCellRender}/>

      <Modal
        title={`Введите данные за ${selectedDate}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <p>Количество отработанных часов:</p>
        <InputNumber
          min={0}
          max={24}
          value={hoursWorked}
          onChange={setHoursWorked}
        />
        <p>Запись:</p>
        <Input.TextArea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Modal>
    </Flex>
  );
};

export default TimeTracker;
