import React from 'react';
import './profile.css'; 
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getDepartment, getPosition, findUserByLogin } from '../../functions/functions';
import PocketBase from 'pocketbase';

const Profile = ({ isOpen, onClose }) => {
  const pb = new PocketBase("http://127.0.0.1:8090")
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('loggedUser')))
  const [departments, setDepartments] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [newLogin, setNewLogin] = useState("")
  const [photo, setPhoto] = useState()
  const [users, setUsers] = useState([])
  const [login, setLogin] = useState(user.username)
  const [password, setPassword] = useState(user.password)

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, onClose]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8090/api/collections/Department/records`)
          .then(response => {
            setDepartments(response.data.items);
          })
          .catch(error => {
            console.error(error);
          });
    setTimeout(() => {
      axios.get(`http://127.0.0.1:8090/api/collections/users/records`)
          .then(response => {
            setUsers(response.data.items);
          })
          .catch(error => {
            console.error(error);
          });
    }, 200)
  }, [])

  const handleAddPhoto = (event) => {
    setPhoto(event.target.files[0]);
    console.log(photo);
  };

  const handleSubmitClick = () => {
    if(isEdit){
      if(newLogin !== ""){
        if (newLogin.length < 8) {
          alert("Длина логина должна быть 8 и более символов!")
          return
        }else if(findUserByLogin(users, newLogin) && newLogin !== user.login){
          alert("Логин не уникальный!")
          return
        }else{
          setLogin(newLogin)
          setTimeout(() => {
            pb.collection('users').update(user.id, {
              'username': newLogin,
            })
          }, 200)
        }
      }
      if(newPassword !== ""){
        setPassword(newPassword)
        setTimeout(() => {
          pb.collection('users').update(user.id, {
            'password': newPassword,
          })
        }, 300)
      }
      if(photo){
        pb.collection('users').update(user.id, {
        'photo': photo,
        })
        setTimeout(() => {
          axios.get(`http://127.0.0.1:8090/api/collections/users/records?filter=(id='${user.id}')`)
            .then(response => {
              localStorage.setItem('loggedUser', JSON.stringify(response.data.items[0]))
              setUser(response.data.items[0])
              setSrc(`http://127.0.0.1:8090/api/files/users/${user.id}/${user.photo}`)
            })
            .catch(error => {
              console.error(error);
            });
        }, 400)
      }
    }
    setNewLogin("")
    setNewPassword("")
    setIsEdit(!isEdit)
  }

  
  return (
    <div ref={dropdownRef} className={`${"profileDropdown"} ${isOpen ? "open" : ""}`}>
        {user.photo 
          ?
          <img className='user-img' src={`http://127.0.0.1:8090/api/files/users/${user.id}/${user.photo}`} alt="" />
          :
          <img className='user-img' src="https://cdn.onlinewebfonts.com/svg/img_217837.png" alt="" />
        }
        <p className='fio-label'>{user.fio}</p>
        <div className='line'/>
        <p className='department-label'>{getDepartment(departments, user.department_id)}</p>
        <p className='position-label'>{getPosition(user.position)}</p>
        <div className='line'/>
        <h1>Редактировать</h1>

        <div className="profile-info-box">
          <div className="profile-info-form">
            <div className="profile-info-input_box">
              <input type="text" disabled={!isEdit} required className="profile-info-input" placeholder="Username" value={isEdit ? newLogin : login} onChange={e=>setNewLogin(e.target.value)}/>
              <label className="profile-info-label">Логин:</label>
            </div>
            <div className="profile-info-input_box">
              <input type="password" disabled={!isEdit} required className="profile-info-input" placeholder="Password" value={isEdit ? newPassword : password} onChange={e=>setNewPassword(e.target.value)}/>
              <label className="profile-info-label">Пароль:</label>
            </div>

            {isEdit &&
              <div className="profile-info-input_box">
                <input type="file" required className="profile-info-input" accept="image/*" onChange={handleAddPhoto}/>
                <label className="profile-info-label">Фото</label>
              </div>
            }
            
          </div>
        </div>
        
        <div className="buttons">
          <button className='profile-button' onClick={e => handleSubmitClick()}>{isEdit ? "Подтвердить" : "Изменить"}</button>
          {isEdit &&
          <button className='profile-button' onClick={e => setIsEdit(!isEdit)}>Отмена</button>
          }
        </div>
    </div>
  );
};

export default Profile;