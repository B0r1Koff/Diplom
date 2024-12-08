import "./contracts.css";
import React, { useState, useEffect } from 'react';
import Navbar from '../2components/navbar/navbar';
import axios from "axios";
import { getPosition, getDepartment, getOverworkingAllowance, getExperienceAllowance, getSalary} from "../functions/functions";

export default function ContractsPage(){
  const [user, setLoggedUser] = useState(JSON.parse(localStorage.getItem('loggedUser')))
  const [contracts, setContracts] = useState([])
  const [users, setUsers] = useState([])
  const [allowances, setAllowances] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    if(user.position === "head"){
      axios.get(`http://127.0.0.1:8090/api/collections/Worker/records?filter=(department_id='${user.department_id}')`)
      .then(response => {
        setUsers(response.data.items);
      })
      .catch(error => {   
        console.error(error);
      });
    } else{
      axios.get(`http://127.0.0.1:8090/api/collections/Worker/records`)
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
          })
          .catch(error => {
            console.error(error);
          });
      }, 600);
  }, [])

  return (
    <div>
      <div className='table-page'>
        <h1 className="contracts-h">Контракты</h1>
        <table>
          <thead>
            <tr>
              <th>ФИО</th>
              <th>Должность</th>
              <th>Подразделение</th>
              <th>Оклад</th>
              <th>Надбавка за стаж</th>
              <th>Надбавка за переработку</th>
            </tr>
          </thead>
          <tbody>
            {users.map(item => (
              <tr key={item.id}>
                <td>{item.fio}</td>
                <td>{getPosition(item.position)}</td>
                <td>{getDepartment(departments, item.department_id)}</td>
                <td>{getSalary(contracts, item.id)}</td>
                <td>{getExperienceAllowance(allowances, item.id)}</td>
                <td>{getOverworkingAllowance(allowances, item.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Navbar/>
    </div>
  );
};