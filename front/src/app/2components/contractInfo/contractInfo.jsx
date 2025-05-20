import "./contractInfo.css"
import { useState } from "react";
import Bonuses from "../bonuses/bonuses";

export default function ContractInfo({contractData, setContractData}){

    const handleContractDataChange = (e) => {
        const { name, value } = e.target;
        setContractData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    return(
      <div className="contract-info-container">   
        <div className="contract-info-box">
          <h3 className="contract-info-h3"><span className="contract-info-span"></span>Контракт</h3>
          <div className="contract-info-form">
            <div className="contract-info-input_box">
              <input type="number" min={650} required className="contract-info-input" name="salary" placeholder="Основная часть оклада" value={contractData.salary} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Основная часть оклада:</label>
            </div>
            <div className="contract-info-input_box">
              <input type="number" max={30} required className="contract-info-input" name="sick_days" placeholder="Число дней отпуска" value={contractData.sick_days} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Число дней отпуска в год:</label>
            </div>
            <div className="contract-info-input_box">
              <input type="date" required className="contract-info-input" name="start_working_date" placeholder="Дата приема на работу" value={contractData.start_working_date} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Дата приема на работу:</label>
            </div>
            <div className="contract-info-input_box">
              <input type="date" required className="contract-info-input" name="date_of_start" placeholder="Дата начала" value={contractData.date_of_start} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Дата начала:</label>
            </div>
            <div className="contract-info-input_box">
              <input type="date" required className="contract-info-input" name="date_of_end" placeholder="Дата завершения" value={contractData.date_of_end} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Дата завершения:</label>
            </div>
          </div>
        </div>
      </div>
    )
}