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
              <input type="number" required className="contract-info-input" name="salary" placeholder="Salary" value={contractData.salary} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Оклад:</label>
            </div>
            <div className="contract-info-input_box">
              <input type="number" required className="contract-info-input" name="sick_days" placeholder="Vacation Days" value={contractData.sick_days} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Число дней отпуска в год:</label>
            </div>
            <div className="contract-info-input_box">
              <input type="date" required className="contract-info-input" name="date_of_start" placeholder="Date of start" value={contractData.date_of_start} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Дата начала:</label>
            </div>
            <div className="contract-info-input_box">
              <input type="date" required className="contract-info-input" name="date_of_end" placeholder="Date of end" value={contractData.date_of_end} onChange={handleContractDataChange}/>
              <label className="contract-info-label">Дата завершения:</label>
            </div>
          </div>
        </div>
      </div>
    )
}