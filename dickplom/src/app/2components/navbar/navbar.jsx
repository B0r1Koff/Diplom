
import React, { useEffect, useState } from 'react';
import "./navbar.css";
import Profile from '../profile/profile';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Navbar(){
    const pathes = {"worker" : ["/main"], "head" : ["/main", "/createContract", "/absenceNotice", "/contracts", "/chartsPage"], "director" : ["/contracts", "/createContract"]}
    const [loggedUser, setLoggedUser] = useState(JSON.parse(localStorage.getItem('loggedUser')))
    const navigation = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileClicked, setIsProfileClicked] = useState(false);

    useEffect(() => {
        const pathesList = pathes[loggedUser.position]
        if(!pathesList.includes(location.pathname)){
            router.push("/")
        }
    }, [])

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        setIsProfileClicked(!isProfileClicked)
    };

    return ( 
        loggedUser.position === "director" ?

        <div className="navbar">
            <div className='nav-start'>
                <button onClick={toggleProfile} disabled={isProfileClicked} className='nav-button'><img className='nav-btn-img' src="https://cdn.onlinewebfonts.com/svg/img_217837.png" alt="fewre" /></button>
                <Profile isOpen={isProfileOpen} onClose={toggleProfile}/>

                <button className='nav-button' onClick={e => navigation("/contracts")}><img className='nav-btn-img' src="https://cdn.onlinewebfonts.com/svg/img_50288.png" alt="" /></button>
                <button className='nav-button' onClick={e => navigation("/createContract")}><img className='nav-btn-img' src="https://cdn.icon-icons.com/icons2/2946/PNG/512/paper_plus_icon_184281.png" alt="" /></button>
            </div>
                
            <div className='nav-end'>
                <button className='nav-button' onClick={e => navigation("/")}><img className='nav-btn-img' src="https://cdn3.iconfinder.com/data/icons/minimalisticons/28/Close-1024.png" alt="" /></button>
            </div>
        </div>

        : loggedUser.position === "head" ? 

        <div className="navbar">
            <div className='nav-start'>
                <button onClick={toggleProfile} disabled={isProfileClicked} className='nav-button'><img className='nav-btn-img' src="https://cdn.onlinewebfonts.com/svg/img_217837.png" alt="fewre" /></button>
                <Profile isOpen={isProfileOpen} onClose={toggleProfile}/>

                <button className='nav-button' onClick={e => navigation("/main")}><img className='nav-btn-img' src="https://cdn4.iconfinder.com/data/icons/48-bubbles/48/12.File-1024.png" alt="" /></button>
                <button className='nav-button' onClick={e => navigation("/createContract")}><img className='nav-btn-img' src="https://cdn.icon-icons.com/icons2/2946/PNG/512/paper_plus_icon_184281.png" alt="" /></button>
                <button className='nav-button' onClick={e => navigation("/absenceNotice")}><img className='nav-btn-img' src="https://premiumwebsites.net/wp-content/uploads/2017/10/google-calendar.png" alt="" /></button>
                <button className='nav-button' onClick={e => navigation("/contracts")}><img className='nav-btn-img' src="https://cdn.onlinewebfonts.com/svg/img_50288.png" alt="" /></button>
                {/* <button className='nav-button' onClick={e => router.push("/chartsPage")}><img className='nav-btn-img' src="https://collegial.sainteanne.ca/wp-content/uploads/2022/01/noun-analytics-4111649-copy-2048x1993.png" alt="" /></button> */}
            </div>
                
            <div className='nav-end'>
                <button className='nav-button' onClick={e => navigation("/")}><img className='nav-btn-img' src="https://cdn3.iconfinder.com/data/icons/minimalisticons/28/Close-1024.png" alt="" /></button>
            </div>
        </div>

        :
        
        <div className="navbar">
            <div className='nav-start'>
                <button onClick={toggleProfile} disabled={isProfileClicked} className='nav-button'><img className='nav-btn-img' src="https://cdn.onlinewebfonts.com/svg/img_217837.png" alt="fewre" /></button>
                <Profile isOpen={isProfileOpen} onClose={toggleProfile}/>
            </div>
                
            <div className='nav-end'>
                <button className='nav-button' onClick={e => navigation("/")}><img className='nav-btn-img' src="https://cdn3.iconfinder.com/data/icons/minimalisticons/28/Close-1024.png" alt="" /></button>
            </div>
            
        </div>
    )
}