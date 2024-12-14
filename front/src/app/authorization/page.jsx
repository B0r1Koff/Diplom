import "./auth.css";
import { useEffect, useState } from 'react';
import userStore from "../store/userStore";
import PocketBase from 'pocketbase';
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Auth(){
    const navigation = useNavigate();
    const pb = new PocketBase("http://127.0.0.1:8090")

    let [login, setLogin] = useState("")
    let [password, setPassword] = useState("")
    const { user, setUser, resetUser } = userStore()

    // const handleAuthClick = () => {
    //     fetch(`http://127.0.0.1:8090/api/collections/Worker/login/${login}/${password}`, {
    //         method: 'GET',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         }
    //       })
    //       .then(response => {
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //       })
    //       .then(data => {
    //         setUser(data.user)
    //         console.log(data.user);
    //         localStorage.setItem('loggedUser', JSON.stringify(data.user))
    //         if(data.user.position === "director"){
    //           navigation("/contracts")
    //         }else{
    //           navigation("/main")
    //         }
            
    //       })
    //       .catch(error => {
    //         console.error('There was a problem with your fetch operation:', error);
    //       });
    // }

    const handleAuthClick = () => {
      const authData = pb.collection('users').authWithPassword(
        login,
        password,
      )
      
      authData.then(data => {
        setUser(data.record)
        
        localStorage.setItem('authToken', JSON.stringify(data.token));
        localStorage.setItem('loggedUser', JSON.stringify(data.record));

        if(data.record.position === "director"){
          navigation("/contracts")
        }else{
          navigation("/main")
        }     
      }).catch(error => {
        console.log(error.toString().split(':')[0]);
        alert(error.toString().split(':')[0]);
      });      
    }

    return (
        <div className="container">
            <div className="box">
                <h3 className="h3"><span className="span"></span>Авторизация</h3>

                <div className="form">

                    <div className="input_box">
                        <input type="text" required className="input" onChange={e => setLogin(e.target.value)}/>
                        <label className="label">Логин</label>
                    </div>
                    <div className="input_box">
                        <input type="password" required className="input" onChange={e => setPassword(e.target.value)}/>
                        <label className="label">Пароль</label>
                    </div>

                    <button type="submit" className="login-button" onClick={handleAuthClick}>Авторизоваться</button>

                </div>
             
            </div>

        </div>
    )
}