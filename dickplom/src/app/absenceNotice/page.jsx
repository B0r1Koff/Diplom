import { useState } from "react"
import "./absenceNotice.css"
import Navbar from "../2components/navbar/navbar"
import Notice from "../2components/notice/notice"
import PocketBase from 'pocketbase';

export default function AbsenceNotice(){
    const pb = new PocketBase("http://127.0.0.1:8090")
    const typesOfAbsence = ["Отпуск", "Больничный", "Оплачиваемый отпуск", "Прогул"]

    const [noticeData, setNoticeData] = useState({
      start_date: "",
      end_date: "",
      type: "",
      worker_id: ""
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if(noticeData.end_date === "" || noticeData.start_date === "" || noticeData.type === "" || noticeData.worker_id === ""){
        alert("Заполните все поля!")
        return
      }
      const record = pb.collection('Notices').create(noticeData);
      record.then(response => {
        if(response.created){
          alert("Уведомление создано")
        }
      })
    };

    return(
        <div className='notice-page'>
          <div className='notice-content'>
            <div className='notice-info-wrapper'>
              <Notice noticeData={noticeData} setNoticeData={setNoticeData}/>
            </div>
            <button className='create-notice-button' onClick={handleSubmit}>Создать</button>
          </div>
          <Navbar/>
        </div>
    )
}
