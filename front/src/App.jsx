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

function App() {
  const myColor = [
    '#fff0e4',
    '#ffe0cf',
    '#fac0a1',
    '#f69e6e',
    '#f28043',
    '#f06e27',
    '#f06418',
    '#d6530c',
    '#bf4906',
    '#a73c00'
  ];
  
  const theme = createTheme({
    colors: {
      myColor,
    }
  });

  return (
    <MantineProvider theme={theme}>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/registration' element={<><Navbar/><Registration/></>}/>
        <Route path='/main' element={<><Navbar/><Main/></>}/>
        <Route path='/contracts' element={<><Navbar/><ContractsPage/></>}/>
        <Route path='/createContract' element={<><Navbar/><CreateContract/></>}/>
        <Route path='/absenceNotice' element={<><Navbar/><AbsenceNotice/></>}/>
        <Route path='/tasks' element={<><Navbar/><TaskPage/></>}/>
        {/* <Route path='/timeTracking' element={<><Navbar/><TimeTracker/></>}/> */}
      </Routes>
    </MantineProvider>
  )
}

export default App
