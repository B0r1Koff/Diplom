import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './/app/authorization/page'
import Registration from './app/registration/page'
import Home from './app/page'
import Main from './app/main/page'
import ContractsPage from './app/contracts/page'
import CreateContract from './app/createContract/page'
import AbsenceNotice from './app/absenceNotice/page'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path='/main' element={<Main/>}/>
        <Route path='/contracts' element={<ContractsPage/>}/>
        <Route path='/createContract' element={<CreateContract/>}/>
        <Route path='/absenceNotice' element={<AbsenceNotice/>}/>
      </Routes>
    </>
  )
}

export default App
