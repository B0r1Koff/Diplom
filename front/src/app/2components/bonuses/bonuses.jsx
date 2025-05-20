import { Button, Col } from "antd";
import "./bonuses.css"
import { useState } from "react";

export default function Bonuses({bonuses, setBonuses}){
  const [newAllowanceName, setNewAllowanseName] = useState('');

  const handleBonusChange = (e) => {
    const { name, value } = e.target;
    setBonuses(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addNewAllowance = () => {
    setBonuses(prevState => ({
      ...prevState,
      [newAllowanceName]: 0
    }));

    setNewAllowanseName('');
  }

    return(
      <div className="bonuses-info-container">   
        <div className="bonuses-info-box">
          <h3 className="bonuses-info-h3"><span className="bonuses-info-span"></span>Надбавки</h3>
              {Object?.keys(bonuses)?.filter(bonus => bonus !== "user_id")?.map(bonus => {
                return(
                   <div className="bonuses-info-form">
                    {/* <div className="bonuses-info-input_box">
                      <input type="text" disabled={true} required className="bonuses-info-input" value={bonus} />
                      <label className="bonuses-info-label">Надбавка:</label>
                    </div> */}
                    <div className="bonuses-info-input_box">
                      <input type="number" required className="bonuses-info-input" placeholder="Введите значение" name={bonus} value={bonuses.bonus} onChange={handleBonusChange}/>
                      <label className="bonuses-info-label">{bonus}</label>
                    </div>
                  </div>
                  )
              })}

                <div className="bonuses-info-form">
                    <div className="bonuses-info-input_box">
                      <input type="text" required className="bonuses-info-input" value={newAllowanceName} onChange={(e) => {setNewAllowanseName(e.target.value)}}/>
                      <label className="bonuses-info-label">Новая надбавка:</label>
                    </div>
                    <Button style={{marginTop: '20px', marginRight: '50px'}} disabled={newAllowanceName?.length === 0} onClick={addNewAllowance}>Добавить</Button>
                  </div>
                {/* <div className="bonuses-info-form">
                  <div className="bonuses-info-input_box">
                    <input type="text" disabled={true} required className="bonuses-info-input" value={"Стаж"}/>
                    <label className="bonuses-info-label">Надбавка:</label>
                  </div>
                  <div className="bonuses-info-input_box">
                    <input type="number" required className="bonuses-info-input" placeholder="Введите значение" name="experience" value={bonuses.experience} onChange={handleBonusChange}/>
                    <label className="bonuses-info-label">Значение:</label>
                  </div>
                </div> */}
            
        </div>
      </div>
    )
}