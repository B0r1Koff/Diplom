import "./bonuses.css"

export default function Bonuses({bonuses, setBonuses}){

  const handleBonusChange = (e) => {
    const { name, value } = e.target;
    setBonuses(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

    return(
      <div className="bonuses-info-container">   
        <div className="bonuses-info-box">
          <h3 className="bonuses-info-h3"><span className="bonuses-info-span"></span>Надбавки</h3>
              
                <div className="bonuses-info-form">
                  <div className="bonuses-info-input_box">
                    <input type="text" disabled={true} required className="bonuses-info-input" value={"Переработка"} />
                    <label className="bonuses-info-label">Надбавка:</label>
                  </div>
                  <div className="bonuses-info-input_box">
                    <input type="number" required className="bonuses-info-input" placeholder="Введите значение" name="overworking" value={bonuses.overworking} onChange={handleBonusChange}/>
                    <label className="bonuses-info-label">Значение:</label>
                  </div>
                </div>

                <div className="bonuses-info-form">
                  <div className="bonuses-info-input_box">
                    <input type="text" disabled={true} required className="bonuses-info-input" value={"Стаж"}/>
                    <label className="bonuses-info-label">Надбавка:</label>
                  </div>
                  <div className="bonuses-info-input_box">
                    <input type="number" required className="bonuses-info-input" placeholder="Введите значение" name="experience" value={bonuses.experience} onChange={handleBonusChange}/>
                    <label className="bonuses-info-label">Значение:</label>
                  </div>
                </div>
            
        </div>
      </div>
    )
}