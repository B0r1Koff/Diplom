import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './app/authorization/Authorization'
import Registration from './app/registration/Registration'
import Home from './app/StartPage'
import Main from './app/main/Payrols'
import ContractsPage from './app/contracts/Contracts'
import CreateContract from './app/createContract/NewContract'
import AbsenceNotice from './app/absenceNotice/Notices'
import TaskPage from './app/pages/tasks/tasks'
import Navbar from './app/2components/navbar/navbar'
import { createTheme, MantineProvider } from '@mantine/core';
import TimeTracker from './app/pages/timeTracking/TimeTracking'
import Pocketbase from 'pocketbase';
import Analitics from './app/pages/analitics/Analitics'
import EnterpriseStructure from './app/pages/structure/Structure'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/registration' element={<><Navbar/><Registration/></>}/>
        <Route path='/main' element={<><Navbar/><Main/></>}/>
        <Route path='/contracts' element={<><Navbar/><ContractsPage/></>}/>
        <Route path='/createContract' element={<><Navbar/><CreateContract/></>}/>
        <Route path='/absenceNotice' element={<><Navbar/><AbsenceNotice/></>}/>
        <Route path='/tasks' element={<><Navbar/><TaskPage/></>}/>
        <Route path='/analytics' element={<><Navbar/><Analitics/></>}/>
        <Route path='/structure' element={<><Navbar/><EnterpriseStructure/></>}/>
        {/* <Route path='/timeTracking' element={<><Navbar/><TimeTracker/></>}/> */}
      </Routes>
    </>
  )
}

export default App
