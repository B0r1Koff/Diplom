import { useState } from "react";
import "./userInfo.css";
import PocketBase from 'pocketbase';
import { useEffect } from "react";


export default function UserInfo({userData, setUserData}){
  const pb = new PocketBase('http://127.0.0.1:8090');

  const [departments, setDepartments] = useState([]);

  const getDepartmanets = () => {
    const data = {
      "name": "test"
    };

    const record = pb.collection('Department').getFullList({
      sort: '-created',
    });

    record?.then(data => {
      console.log(data);
      setDepartments([null, ...data]);    
    })
  }

    const handleUserDataChange = (e) => {
        console.log(e?.target?.value)
        const { name, value } = e.target;
        setUserData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    useEffect(() => {
      getDepartmanets()
    }, []);

    return(
      <div className="worker-info-container">   
        <div className="worker-info-box">
          <h3 className="worker-info-h3"><span className="worker-info-span"></span>Работник</h3>
          <div className="worker-info-form">
            <div className="worker-info-input_box">
              <input type="text" required className="worker-info-input" name="fio" placeholder="ФИО" value={userData.fio} onChange={handleUserDataChange}/>
              <label className="worker-info-label">ФИО:</label>
            </div>
            <div className="worker-info-input_box">
              <input type="text" required className="worker-info-input" name="login" placeholder="Логин" value={userData.login} onChange={handleUserDataChange}/>
              <label className="worker-info-label">Логин:</label>
            </div>
            <div className="worker-info-input_box">
              <input type="password" required className="worker-info-input" name="password" placeholder="Пароль" value={userData.password} onChange={handleUserDataChange}/>
              <label className="worker-info-label">Пароль:</label>
            </div>
            <div className="worker-info-input_box">
              <input type="text" required className="worker-info-input" name="role" placeholder="Должность" value={userData.role} onChange={handleUserDataChange}/>
              <label className="worker-info-label">Должность:</label>
            </div>
            {departments?.length > 0 &&
            <div className="worker-info-input_box">
              <select type="text" required className="worker-info-input" name="department_id" placeholder="Отдел" value={userData.department_id} onChange={handleUserDataChange}>
                {departments?.map(department => {
                  return <option value={department?.id} key={department?.id}>{department?.name}</option>
                })}
              </select>
              <label className="worker-info-label">Отдел:</label>
            </div>
            } 
          </div>
        </div>
      </div>
    )
}