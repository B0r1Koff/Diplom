import Navbar from '../2components/navbar/navbar'
import "./main.css";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Main() {
    const [user, setLoggedUser] = useState(JSON.parse(localStorage.getItem('loggedUser')))
    const monthes = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",]

    const [date, setDate] = useState()
    const [data, setData] = useState([])
    const [contractSalary, setContractSalary] = useState(0)
    const [department, setDepartment] = useState("")
    const [isData, setIsData] = useState(false)

  useEffect(() => {
    axios.get(`http://127.0.0.1:8090/api/collections/MonthData/records?filter=(worker_id='${user.id}')`)
      .then(response => {
        setDate(monthes[new Date(response.data.items[0].date.substring(0,10)).getMonth()])
        setData(response.data.items);
        setIsData(true)
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
        axios.get(`http://127.0.0.1:8090/api/collections/Contract/records?filter=(worker_id='${user.id}')`)
          .then(response => {
            setContractSalary(response.data.items[0].salary);
          })
          .catch(error => {
            console.error(error);
          });
      }, 400);
  }, [])

    const generatePDF = () => {
        const input = document.getElementById('report');
        html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.save("Расчетный лист");
      });
    }

    const dateOptions = data.map(item => {
        return <option key={item.id}>{monthes[new Date(item.date.substring(0,10)).getMonth()]}</option>
    });

    const getSalary = (arg) => {
      let result = 0
      data.map(item => {
        if(monthes[new Date(item.date.substring(0,10)).getMonth()] === date){
          arg === 1 ? result = item.salary : arg === 2 ? result = item.allowances : result = item.deductions
        }
      })

      return result;
    }

    return (
        <div className='mainpage'>
          
          {isData ? 
                <div className="payslip">
  
                <div className='month-options'>
                    <select className="select-month" value={date} onChange = {(event) => setDate(event.target.value)}>
			                {dateOptions}
		                </select>
                    <label className='select-month-label'>Месяц:</label>
                </div>

                    <div id="report">
                        <h1 className="payslip-h">Расчетный лист</h1>
                        <p className='payslip-field'>Организация: ОАО "Чпок и в гроб"</p>
                        <p className='payslip-field'>Подразделение: {department}</p>
                        <p className='payslip-field'>ФИО работника: {user.fio}</p>
                        <p className='payslip-field'>Должность: {user.position === "worker" ? "Сотрудник" : "Руководитель отдела"}</p>
                        <p className='payslip-field'>Оклад: {contractSalary}</p>
                        <p className='payslip-field'>Выплата за месяц: {date}</p>
                        <p className='payslip-field'>Размер выплаты: {getSalary(1)}</p>
                        <p className='payslip-field'>Размер надбавок: {getSalary(2)}</p>
                        <p className='payslip-field'>Размер удержаний: {getSalary(3)}</p>
                    </div>

            </div>

            :

            <><h1>У вас нет расчетных листов</h1></>
          }
            
            {
              isData && <button className="save-payslip-btn" onClick={(e)=>{generatePDF()}}>Сохранить</button>
            }
            
            <Navbar/>
        </div>
    )
}