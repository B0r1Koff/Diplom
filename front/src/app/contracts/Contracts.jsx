import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Table, Descriptions, Radio, Spin, Button } from "antd";
import { getPosition, getDepartment, getOverworkingAllowance, getExperienceAllowance, getSalary, getStartDate, getEndDate } from "../functions/functions";

export default function ContractsPage() {
  const [user, setLoggedUser] = useState(JSON.parse(localStorage.getItem('loggedUser')));
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mode, setMode] = useState("Contracts");
  const [isLoading, setIsLoading] = useState(false);

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  useEffect(() => {
    setIsLoading(true);
    if (user.position === "head") {
      axios.get(`http://127.0.0.1:8090/api/collections/users/records?filter=(department_id='${user.department_id}')`)
        .then(response => {
          setUsers(response.data.items);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      axios.get(`http://127.0.0.1:8090/api/collections/users/records`)
        .then(response => {
          setUsers(response.data.items);
        })
        .catch(error => {
          console.error(error);
        });
    }

    setTimeout(() => {
      axios.get(`http://127.0.0.1:8090/api/collections/Contract/records`)
        .then(response => {
          setContracts(response.data.items);
        })
        .catch(error => {
          console.error(error);
        });
    }, 200);

    setTimeout(() => {
      axios.get(`http://127.0.0.1:8090/api/collections/Allowances/records`)
        .then(response => {
          setAllowances(response.data.items);
        })
        .catch(error => {
          console.error(error);
        });
    }, 400);

    setTimeout(() => {
      axios.get(`http://127.0.0.1:8090/api/collections/Department/records`)
        .then(response => {
          setDepartments(response.data.items);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
        });
    }, 600);
  }, []);

  const contractsColumns = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
    },
    {
      title: 'Должность',
      dataIndex: 'position',
      key: 'position',
      render: (_, record) => getPosition(record?.position),
    },
    {
      title: 'Отдел',
      dataIndex: 'department_id',
      key: 'department_id',
      render: (department_id) => getDepartment(departments, department_id) || '-',
    },
    {
      title: 'Дата начала',
      key: 'startDate',
      render: (_, record) => getStartDate(contracts, record.id),
    },
    {
      title: 'Дата завершения',
      key: 'endDate',
      render: (_, record) => getEndDate(contracts, record.id),
    },
    {
      title: 'Оклад',
      key: 'salary',
      render: (_, record) => getSalary(contracts, record.id),
    },
    {
      title: 'Надбавки',
      key: 'allowances',
      render: (_, record) => (
        <Descriptions column={1} style={{width: '200px', border: 'none'}}>
          {allowances
            ?.filter(allowance => allowance?.user_id === record?.id)
            ?.map((allowance, index) => (
              <React.Fragment key={index}>
                {Object.keys(allowance?.params || {})?.map((item, i) => (
                  <Descriptions.Item style={{border: 'none'}} key={i} label={item}>
                    {allowance.params[item]}%
                  </Descriptions.Item>
                ))}
              </React.Fragment>
            ))}
        </Descriptions>
      ),
    },
  ];

  return (
      <div className='table-page'>
        {user?.position === "director" &&
          <Radio.Group onChange={handleModeChange} value={mode} style={{position: 'absolute', top: '65px', left: '20px'}}>
            <Radio.Button value="Contracts">Контракты</Radio.Button>
            <Radio.Button value="Payslip">Начисления</Radio.Button>
          </Radio.Group>
        }
        {mode !== "Contracts" &&
          <Button type='primary' style={{position: 'absolute', top: '110px', left: '20px'}}>Рассчитать зарплаты сотрудников за прошедший месяц</Button>
        }
        <Table loading={isLoading} style={{marginTop: mode === "Contracts" ? '100px' : '150px'}} dataSource={users} columns={contractsColumns} rowKey="id" pagination={false}/>
      </div>
  );
}
