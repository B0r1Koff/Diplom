import "./userInfo.css"

export default function UserInfo({userData, setUserData}){

    const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    return(
      <div className="worker-info-container">   
        <div className="worker-info-box">
          <h3 className="worker-info-h3"><span className="worker-info-span"></span>Работник</h3>
          <div className="worker-info-form">
            <div className="worker-info-input_box">
              <input type="text" required className="worker-info-input" name="fio" placeholder="Full Name" value={userData.fio} onChange={handleUserDataChange}/>
              <label className="worker-info-label">ФИО:</label>
            </div>
            <div className="worker-info-input_box">
              <input type="text" required className="worker-info-input" name="login" placeholder="Username" value={userData.login} onChange={handleUserDataChange}/>
              <label className="worker-info-label">Логин:</label>
            </div>
            <div className="worker-info-input_box">
              <input type="password" required className="worker-info-input" name="password" placeholder="Password" value={userData.password} onChange={handleUserDataChange}/>
              <label className="worker-info-label">Пароль:</label>
            </div>
          </div>
        </div>
      </div>
    )
}