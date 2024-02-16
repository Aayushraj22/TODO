import React from 'react'
import './authWrapper.css'
import { Outlet } from 'react-router-dom'

function AuthWrapper({children}) {
  return (
    <div className='authWrapper-container'>
        <Outlet />
    </div>
  )
}

export default AuthWrapper