import React, { useState } from 'react';
import { Calendar, Modal, InputNumber, Input, Button, Flex } from 'antd';
import moment from 'moment';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';

const TimeTracker = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [notes, setNotes] = useState('');

  const showModal = (date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    console.log(`Date: ${selectedDate}, Hours Worked: ${hoursWorked}, Notes: ${notes}`);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
