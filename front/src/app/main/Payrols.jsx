import Navbar from '../2components/navbar/navbar'
import "./main.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TimeTracker from '../pages/timeTracking/TimeTracking';
import { Flex, Radio } from 'antd';

export default function Main() {
    const [user, setLoggedUser] = useState(JSON.parse(localStorage.getItem('loggedUser')))
    const monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",]

    const [date, setDate] = useState()
    const [data, setData] = useState([])
    const [contractSalary, setContractSalary] = useState(0)
    const [department, setDepartment] = useState("")
    const [isData, setIsData] = useState(false);
    const [selectedMonthData, setSelectedMonthData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const [mode, setMode] = useState('calendar');

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  useEffect(() => {
    if(mode === "payslip"){
    axios.get(`http://127.0.0.1:8090/api/collections/MonthData/records?filter=(user_id='${user.id}')`)
      .then((response) => {
          if(response?.data?.items?.length > 0){
            console.log(response?.data?.items?.reverse()?.[0]?.params)
            setDate(`${monthes[response?.data?.items?.reverse()?.[0]?.month]} ${response?.data?.items?.reverse()?.[0]?.year}`)
            setData(response?.data?.items?.reverse());
            setSelectedMonthData(response?.data?.items?.reverse()?.[0]?.params);
            setSelectedYear(response?.data?.items?.reverse()?.[0]?.year);
        }
      })
      .catch(error => {
        console.error(error);
      });
      setTimeout(() => {
        axios.get(`http://127.0.0.1:8090/api/collections/Department/records?filter=(id='${user.department_id}')`)
          .then(response => {
            setDepartment(response.data.items[0].name);
          })
          .catch(error => {
            console.error(error);
        });
      }, 200);
      setTimeout(() => {
        axios.get(`http://127.0.0.1:8090/api/collections/Contract/records?filter=(user_id='${user.id}')`)
          .then(response => {
            setContractSalary(response.data.items[0].salary);
          })
          .catch(error => {
            console.error(error);
          });
      }, 400);
    }
  }, [mode])

    const generatePDF = () => {
        const input = document.getElementById('report');
        html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save(`${date} расчетный лист`);
      });
    }

    const dateOptions = data.map(item => {
        return <option key={item.id}>{`${monthes[item?.month - 1]} ${item?.year}`}</option>
    });

    const getSalary = (arg) => {
      let result = 0
      data.map(item => {
        if(monthes[item?.month-1] === date){
          arg === 1 ? result = item.salary : arg === 2 ? result = item.allowances : result = item.deductions
        }
      })

      return result;
    }

    const onSelectMonth = (e) => {
      const dateArr = e.target.value.split(" ")
      setDate(e.target.value);
      setSelectedMonthData(data?.filter(item => item?.month === monthes?.indexOf(dateArr[0])+1 && item?.year === parseInt(dateArr[1]))[0]?.params); 
      setSelectedYear(dateArr[1]);           
    };

    return (
      <>
      <Flex style={{position: 'absolute', top: '60px', left: '20px'}}>
        <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }}>
          <Radio.Button value="calendar">Рабочие записи</Radio.Button>
          <Radio.Button value="payslip">Расчетные листы</Radio.Button>
        </Radio.Group>
      </Flex>
        {mode === "payslip" ?
        <div className='mainpage'>
          {selectedMonthData ? 
                <div className="payslip">
  
                <div className='month-options'>
                    <select className="select-month" value={date} onChange = {(event) => onSelectMonth(event)}>
			                {dateOptions}
		                </select>
                    <label className='select-month-label'>Месяц:</label>
                </div>

                    <div id="report">
                        <h1 className="payslip-h">Расчетный лист</h1>
                        <p className='payslip-field'>Организация: ОАО "Название компании"</p>
                        <p className='payslip-field'>Подразделение: {department}</p>
                        <p className='payslip-field'>ФИО работника: {user.fio}</p>
                        <p className='payslip-field'>Должность: {user?.role || (user.position === "worker" ? "Сотрудник" : "Руководитель отдела")}</p>
                        <p className='payslip-field'>Оклад: {contractSalary}</p>
                        <p className='payslip-field'>Выплата за: {date}</p>
                        <p className='payslip-field'>Основная часть зарплаты: {selectedMonthData?.salary}</p>
                        <p className='payslip-field'>Надбавки: </p>
                        {Object?.keys(selectedMonthData?.allowances)?.length === 0 ? <p className='payslip-field'>-</p> :
                          Object?.keys(selectedMonthData?.allowances)?.map(item => {
                            return (<p style={{marginLeft: '30px'}}>{`${item}: ${selectedMonthData?.allowances?.[item]}`}</p>)
                          })
                        }
                        <p className='payslip-field'>Размер удержаний: {selectedMonthData?.deductions}</p>
                        <p className='payslip-field'>Выплачено: {selectedMonthData?.totalSalary}</p>
                    </div>

            </div>

            :

            <><h1>У вас нет расчетных листов</h1></>
          }
            
            {
              selectedMonthData && <button className="save-payslip-btn" onClick={(e)=>{generatePDF()}}>Сохранить</button>
            }
            
            {/* <Navbar/> */}
        </div>

        :  <TimeTracker/>
}
           </>
    )
}