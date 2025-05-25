import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Table, Descriptions, Radio, Spin, Button, notification, Flex, Select, Row, Avatar } from "antd";
import { getPosition, getDepartment, getOverworkingAllowance, getExperienceAllowance, getSalary, getStartDate, getEndDate } from "../functions/functions";
import Pocketbase from 'pocketbase';
import Icon from '@mdi/react';
import { mdiAccount, mdiAccountOutline } from '@mdi/js';

export default function ContractsPage() {
  const pb = new Pocketbase('http://127.0.0.1:8090');
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const [user, setLoggedUser] = useState(JSON.parse(localStorage.getItem('loggedUser')));
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mode, setMode] = useState("Contracts");
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculationAllowed, setIsCalculationAllowed] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [monthData, setMonthData] = useState([]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  const years = Array.from({ length: 10 }, (_, i) => ({
    value: year - 9 + i,
    label: year - 9 + i
  }));

  const holidays = [
    new Date(year, 0, 1),   // 1 января – Новый год
    new Date(year, 0, 2),   // 2 января – Новый год
    new Date(year, 0, 7),   // 7 января – Рождество Христово
    new Date(year, 2, 8),   // 8 марта – День женщин
    new Date(year, 3, 29),  // 29 апреля – Радуница
    new Date(year, 4, 1),   // 1 мая – Праздник труда
    new Date(year, 4, 9),   // 9 мая – День Победы
    new Date(year, 6, 3),   // 3 июля – День Независимости Республики Беларусь
    new Date(year, 10, 7),  // 7 ноября – День Октябрьской революции
    new Date(year, 11, 25)  // 25 декабря – Рождество Христово (католическое Рождество)
  ];

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  const fetchMonthData = () => {
    if(mode !== "Contracts"){
      setIsLoading(true);
      const resultList = pb.collection('MonthData').getFullList({
        filter: `month = '${selectedMonth + 1}' && year = '${selectedYear}'`,
      });

      resultList.then((data) => {
        setMonthData(data);
        setIsLoading(false);
      }).catch((error) => {
        notification.error({
          message: 'Ошибка',
          description: `Произошла ошибка: ${error.message}`,
        });
      })
    };
  };

  useEffect(() => {
    pb.collection('MonthData').getList(1, 1, {
      filter: `month = '${month}' && year = '${year}'`,
    }).then(({ items }) => {
      if (items?.length === 0) {
        setIsCalculationAllowed(true);
      } else {
        setIsCalculationAllowed(false);
      }
    });
  }, []);

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
    }, 100);

    setTimeout(() => {
      axios.get(`http://127.0.0.1:8090/api/collections/Allowances/records`)
        .then(response => {
          setAllowances(response.data.items);
        })
        .catch(error => {
          console.error(error);
        });
    }, 200);

    setTimeout(() => {
      axios.get(`http://127.0.0.1:8090/api/collections/Department/records`)
        .then(response => {
          setDepartments(response.data.items);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
        });
    }, 300);
  }, []);

  useEffect(() => {
    fetchMonthData();
  }, [selectedMonth, selectedYear]);

 const getMaxWorkingHours = () => {
      let maxWorkingHours = 0;

      const daysInMonth = new Date(year, month-1 , 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day);
        const dayOfWeek = currentDate.getDay();

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const isHoliday = holidays.some(holiday => {
          return holiday.getDate() === day && holiday.getMonth() === month - 1;
        });

        if (!isWeekend && !isHoliday) {
          maxWorkingHours += 8;
        }
      }

      return maxWorkingHours;
  };

  const getTotalHoursWorked = (report, notices) => {
    let totalHoursWorked = 0;

      for (const day in report) {
        if (report.hasOwnProperty(day)) {
          const dayReport = report[day];
          const dayDate = new Date(year, month - 1, parseInt(day, 10));

          const noticeForDay = notices.find(notice => {
            const noticeStartDate = new Date(notice.start_date);
            const noticeEndDate = new Date(notice.end_date);
            return dayDate >= noticeStartDate && dayDate <= noticeEndDate;
          });

          if (noticeForDay) {
            if (noticeForDay.type !== "Оплачиваемый отпуск") {
              totalHoursWorked += 8;
            } else {
              totalHoursWorked += 0;
            }
          } else {
            totalHoursWorked += dayReport.hours || 0;
          }
        }
      }

      return totalHoursWorked;
  }

  const onCalculationButtonClick = async () => {
  for (let i = 0; i < contracts?.length; i++) {
    const contract = contracts[i];

    const noticesRes = await pb.collection('Notices').getList(1, 50, {
      filter: `user_id = '${contract?.user_id}'`,
      requestKey: contract?.id
    });
    const notices = noticesRes?.items || [];

    const kpiRes = await pb.collection('KPI').getList(1, 1, {
      filter: `month = '${month}' && year = '${year}' && user_id = '${contract?.user_id}'`,
      requestKey: contract?.id
    });
    const kpi = kpiRes?.items?.[0]?.number || 0;

    const userAllowances = allowances?.filter(allowance => allowance?.user_id === contract?.user_id)?.[0]?.params || {};

    if (contract?.is_time_based) {
      const reportRes = await pb.collection('Reports').getList(1, 1, {
        filter: `month = '${month}' && year = '${year}' && user_id = '${contract?.user_id}'`,
        requestKey: contract?.id
      });
      const report = reportRes?.items?.[0]?.params || {};

      const totalHoursWorked = getTotalHoursWorked(report, notices);
      const maxWorkingHours = getMaxWorkingHours();

      const percentageHoursWorked = (totalHoursWorked / maxWorkingHours);

      const kpiPercent = (kpi / 30);

      let salary = kpiPercent * percentageHoursWorked * contract?.salary + percentageHoursWorked * contract?.salary

      let totalSalary = salary;

      let allowancesParams = {};

      Object.keys(userAllowances)?.map(allowance => {
        totalSalary += (userAllowances?.[allowance]/100) * salary;
        allowancesParams[allowance] = ((userAllowances?.[allowance]/100) * salary).toFixed(0);
      });

      let deductions = totalSalary * 0.13;

      totalSalary *= 0.87;

      const data = {
        "user_id": contract?.user_id,
        "params": {
          allowances: allowancesParams,
          kpi: (kpiPercent * 100).toFixed(2),
          hoursWorked: (percentageHoursWorked * 100).toFixed(2),
          salary: salary.toFixed(2),
          totalSalary: totalSalary.toFixed(2),
          deductions: deductions.toFixed(2)
        },
        "month": month,
        "year": year,
      };

      const record = await pb.collection('MonthData').create(data);
    }else{
      const kpiPercent = (kpi / 30);

      let salary = kpiPercent * contract?.salary + contract?.salary

      let totalSalary = salary;

      let allowancesParams = {};

      Object.keys(userAllowances)?.map(allowance => {
        totalSalary += (userAllowances?.[allowance]/100) * salary;
        allowancesParams[allowance] = ((userAllowances?.[allowance]/100) * salary).toFixed(0);
      });

      let deductions = totalSalary * 0.13;

      totalSalary *= 0.87;

      const data = {
        "user_id": contract?.user_id,
        "params": {
          allowances: allowancesParams,
          kpi: (kpiPercent * 100).toFixed(2),
          salary: salary.toFixed(2),
          totalSalary: totalSalary.toFixed(2),
          deductions: deductions.toFixed(2)
        },
        "month": month,
        "year": year,
      };

      const record = await pb.collection('MonthData').create(data);
    }
  }
  
    setIsCalculationAllowed(false);
    fetchMonthData();
    notification.success({
      message: 'Успех',
      description: `Расчет завершен`,
    });
};

  const contractsColumns = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
      render: (_, record) => (
      <Row style={{alignItems: 'center'}}>
        <Avatar
          src={record?.photo ? `http://127.0.0.1:8090/api/files/users/${record.id}/${record.photo}` : null}
          icon={!record?.photo ? <Icon path={mdiAccountOutline} size={1} /> : null}
          style={{ marginRight: '8px' }}
        />
        {record?.fio}
      </Row>)
    },
    {
      title: 'Должность',
      dataIndex: 'position',
      key: 'position',
      render: (_, record) => record?.role || getPosition(record?.position),
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
        <Descriptions column={1} style={{ width: '200px', border: 'none' }}>
          {allowances
            ?.filter(allowance => allowance?.user_id === record?.id)
            ?.map((allowance, index) => (
              <React.Fragment key={index}>
                {Object.keys(allowance?.params || {})?.map((item, i) => (
                  <Descriptions.Item style={{ border: 'none' }} key={i} label={item}>
                    {allowance.params[item]}%
                  </Descriptions.Item>
                ))}
              </React.Fragment>
            ))}
        </Descriptions>
      ),
    },
  ];

  const accrualsColumns = [
    {
      title: 'ФИО',
      dataIndex: 'fio',
      key: 'fio',
      render: (_, record) => (
      <Row style={{alignItems: 'center'}}>
        <Avatar
          src={record?.photo ? `http://127.0.0.1:8090/api/files/users/${record.id}/${record.photo}` : null}
          icon={!record?.photo ? <Icon path={mdiAccountOutline} size={1} /> : null}
          style={{ marginRight: '8px' }}
        />
        {record?.fio}
      </Row>)
    },
    {
      title: 'Должность',
      dataIndex: 'position',
      key: 'position',
      render: (_, record) => record?.role || getPosition(record?.position),
    },
    {
      title: 'Отдел',
      dataIndex: 'department_id',
      key: 'department_id',
      render: (department_id) => getDepartment(departments, department_id) || '-',
    },
    {
      title: 'Отработано часов (%)',
      key: 'hoursWorked',
      render: (_, record) => monthData?.filter(data => data?.user_id === record?.id)?.[0]?.params?.hoursWorked || '-',
    },
    {
      title: 'KPI (%)',
      key: 'salary',
      render: (_, record) => monthData?.filter(data => data?.user_id === record?.id)?.[0]?.params?.kpi || '-',
    },
    {
      title: 'Основная часть',
      key: 'startDate',
      render: (_, record) => monthData?.filter(data => data?.user_id === record?.id)?.[0]?.params?.salary || '-',
    },
    {
      title: 'Надбавки',
      key: 'allowances',
      render: (_, record) => (
        <Descriptions column={1} style={{ width: '200px', border: 'none' }}>
          {monthData
            ?.filter(data => data?.user_id === record?.id)
            ?.map((a, index) => (
              <React.Fragment key={index}>
                {Object.keys(a?.params?.allowances || {})?.map((item, i) => (
                  <Descriptions.Item style={{ border: 'none' }} key={i} label={item}>
                    {a?.params?.allowances?.[item]}
                  </Descriptions.Item>
                ))}
              </React.Fragment>
            ))}
        </Descriptions>
      ),
    },
    {
      title: 'Вычтено',
      key: 'endDate',
      render: (_, record) => monthData?.filter(data => data?.user_id === record?.id)?.[0]?.params?.deductions || '-',
    },
    {
      title: 'Выплачено',
      key: 'salary',
      render: (_, record) => monthData?.filter(data => data?.user_id === record?.id)?.[0]?.params?.totalSalary || '-',
    },
  ];

  return (
    <div className='table-page'>
      <Radio.Group onChange={handleModeChange} value={mode} style={{ position: 'absolute', top: '65px', left: '20px' }}>
        <Radio.Button value="Contracts">Контракты</Radio.Button>
        <Radio.Button value="Payslip">Начисления</Radio.Button>
      </Radio.Group>
        <Flex gap={'small'} style={{ position: 'absolute', top: '110px', left: '20px' }}>
         {mode !== "Contracts" && user?.position === "director" &&
          <Button disabled={!isCalculationAllowed} type='primary' onClick={onCalculationButtonClick}>Рассчитать зарплаты сотрудников за прошедший месяц</Button>
         }
          <Select
            value={selectedMonth}
            style={{ width: 120 }}
            onChange={(value) => setSelectedMonth(value)}
          >
            {months.map(month => (
              <Select.Option key={month.value} value={month.value}>
                {month.label}
              </Select.Option>
            ))}
          </Select>
          <Select
            value={selectedYear}
            style={{ width: 80 }}
            onChange={(value) => setSelectedYear(value)}
          >
            {years.map(year => (
              <Select.Option key={year.value} value={year.value}>
                {year.label}
              </Select.Option>
            ))}
          </Select>
        </Flex>
      <Table loading={isLoading} style={{ marginTop: mode === "Contracts" ? '100px' : '150px' }} dataSource={users} columns={mode === "Contracts" ? contractsColumns : accrualsColumns} rowKey="id" pagination={false} />
    </div>
  );
}
