import './createContract.css'; 
import Navbar from '../2components/navbar/navbar'
import { useEffect, useState } from 'react';
import UserInfo from '../2components/userInfo/userInfo';
import ContractInfo from '../2components/contractInfo/contractInfo';
import Bonuses from '../2components/bonuses/bonuses';
import PocketBase from 'pocketbase';
import axios from 'axios';
import { findUserByLogin } from '../functions/functions';

export default function CreateContract(){
    const [user, setLoggedUser] = useState(JSON.parse(localStorage.getItem('loggedUser')) || null)
    const pb = new PocketBase("http://127.0.0.1:8090")
    const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8090/api/collections/users/records')
      .then(response => {
        setUsers(response.data.items);
      })
      .catch(error => {
        console.error(error);
      });
  }, [])

    const [newDepartment, setNewDepartment] = useState("")

    const [userData, setUserData] = useState({
        fio: '',
        login: '',
        password: '',
        department_id: user.department_id,
        position: 'worker'
      });
    
      const [contractData, setContractData] = useState({
        salary: '',
        sick_days: '',
        date_of_start: '',
        date_of_end: '',
        user_id: ''
      });

      const [bonuses, setBonuses] = useState({
        experience: 0,
        overworking: 0,
        user_id: ''
      });

      const handleSubmit = () => {
        if(user.position === "director" && newDepartment !== ""){
        
          const record = pb.collection('Department').create({
            "name": newDepartment
          });
          record.then(function({id}){
            if(userData.fio === "" || userData.login === "" || userData.password === "" || contractData.date_of_end === "" || contractData.date_of_start === "" || contractData.salary === "" || contractData.sick_days === ""){
          alert("Заполните все поля!")
          return
        }
        if(userData.login.length < 8){
          alert("Длина логина должна быть 8 и более символов!")
          return
        }
        if(findUserByLogin(users, userData.login)){
          alert("Логин сотрудника не уникальный!")
          return
        }
        if(Math.abs(bonuses.experience ) > 15 || Math.abs(bonuses.overworking) > 15){
          alert("Размер надбавки не должен превышать 15 процентов!")
          return
        }
        const worker = pb.collection('users').create({
          "fio": userData.fio,
          "email": null,
          "emailVisibility": true,
          "username": userData.login,
          "password": userData.password,
          "passwordConfirm": userData.password,
          "department_id": id,
          "position": "head"
        });
        worker.then(function({id}){
          const contract = pb.collection('Contract').create({
            "salary": contractData.salary,
            "sick_days": contractData.sick_days,
            "users_id": id,
            "date_of_start": contractData.date_of_start,
            "date_of_end": contractData.date_of_end
        });
          const experienceAllowance = pb.collection('Allowances').create({
            "percent": parseInt(Math.abs(bonuses.experience)) || 0,
            "type": "experience",
            "user_id": id
          });
          setTimeout(() => {
            const overworkingAllowance = pb.collection('Allowances').create({
              "percent": parseInt(Math.abs(bonuses.overworking)) || 0,
              "type": "overworking",
              "user_id": id
            });
          }, 300);
        })
          })

          alert("Отдел создан!")
        }
        else{
        
        if(userData.fio === "" || userData.login === "" || userData.password === "" || contractData.date_of_end === "" || contractData.date_of_start === "" || contractData.salary === "" || contractData.sick_days === ""){
          alert("Заполните все поля!")
          return
        }
        if(userData.login.length < 8){
          alert("Длина логина должна быть 8 и более символов!")
          return
        }
        if(findUserByLogin(users, userData.login)){
          alert("Логин сотрудника не уникальный!")
          return
        }
        if(Math.abs(bonuses.experience ) > 15 || Math.abs(bonuses.overworking) > 15){
          alert("Размер надбавки не должен превышать 15 процентов!")
          return
        }
        const worker = pb.collection('users').create({
          "fio": userData.fio,
          "email": null,
          "emailVisibility": true,
          "username": userData.login,
          "password": userData.password,
          "passwordConfirm": userData.password,
          "department_id": userData.department_id,
          "position": "worker"
        });
        worker.then(function({id}){
          const contract = pb.collection('Contract').create({
            "salary": contractData.salary,
            "sick_days": contractData.sick_days,
            "user_id": id,
            "date_of_start": contractData.date_of_start,
            "date_of_end": contractData.date_of_end
        });
          const experienceAllowance = pb.collection('Allowances').create({
            "percent": parseInt(Math.abs(bonuses.experience)) || 0,
            "type": "experience",
            "user_id": id
          });
          setTimeout(() => {
            const overworkingAllowance = pb.collection('Allowances').create({
              "percent": parseInt(Math.abs(bonuses.overworking)) || 0,
              "type": "overworking",
              "user_id": id
            });
          }, 300);
        })
        }

        alert("Сотрудник зарегистрирован!")
      };

    return(
        <div className='contract-page'>
          <div className='contract-content'>
            <div className='contract-info-wrapper'>
              <UserInfo userData={userData} setUserData={setUserData}/>
              <ContractInfo contractData={contractData} setContractData={setContractData}/>
              <Bonuses bonuses={bonuses} setBonuses={setBonuses}/>
            </div>
            {user.position === "director" && 
              <div className="worker-info-container">   
              <div className="worker-info-box">
              <h3 className="worker-info-h3"><span className="worker-info-span"></span>Отделение</h3>
                <div className="worker-info-form">
                  <div className="worker-info-input_box">
                    <input type="text" required className="worker-info-input" name="login" placeholder="Department name" value={newDepartment} onChange={e => setNewDepartment(e.target.value)}/>
                    <label className="worker-info-label">Название:</label>
                  </div>
                </div>
              </div>
              </div>
            }
            <button className='create-contract-button' onClick={handleSubmit}>Создать</button>
          </div>
          {/* <Navbar/> */}
        </div>
    )
}