import { useState, useEffect } from "react"
import "./notice.css"
import axios from "axios";

export default function Notice({noticeData, setNoticeData}){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedUser')))
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get(`http://127.0.0.1:8090/api/collections/users/records`)
      .then(response => {
        console.log(response.data.items);
        
        setUsers(response.data.items);
      })
      .catch(error => {
        console.error(error);
      });
  }, [])

    const typesOfAbsence = ["Отпуск", "Больничный", "Оплачиваемый отпуск", "Прогул"]

    const handleNoticeDataChange = (e) => {
        let { name, value } = e.target;
        if(name === "user_id"){
          users.map(user => {
            if(value === user.fio){
              value = user.id
            }
          })
        }
        setNoticeData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    const noticeOptions = typesOfAbsence.map(type => {
        return <option key={type}>{type}</option>
    });

    const userOptions = users.map(user => {
      if(user.department_id !== ""){
        return <option key={user.id}>{user.fio}</option>
      }
  });

    return(
      <div className="notice-info-container"> 
        <div className="notice-info-box">
          <h3 className="notice-info-h3"><span className="notice-info-span"></span>Уведомление</h3>
          <div className="notice-info-form">
          <div className="notice-info-input_box">
              <select type="text" required className="notice-info-input" name="user_id" placeholder="Full Name" onChange={handleNoticeDataChange}>
                {userOptions}
              </select>
              <label className="notice-info-label">Сотрудник:</label>
            </div>
            <div className="notice-info-input_box">
              <select type="text" required className="notice-info-input" name="type" placeholder="Type" value={noticeData.type} onChange={handleNoticeDataChange}>
                {noticeOptions}
              </select>
              <label className="notice-info-label">Тип:</label>
            </div>
            <div className="notice-info-input_box">
              <input type="date" required className="notice-info-input" name="start_date" placeholder="Username" value={noticeData.start_date} onChange={handleNoticeDataChange}/>
              <label className="notice-info-label">Дата начала:</label>
            </div>
            <div className="notice-info-input_box">
              <input type="date" required className="notice-info-input" name="end_date" placeholder="Password" value={noticeData.end_date} onChange={handleNoticeDataChange}/>
              <label className="notice-info-label">Дата завершения:</label>
            </div>
          </div>
        </div>
      </div>
    )
}
