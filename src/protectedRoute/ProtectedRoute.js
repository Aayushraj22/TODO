import React from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import './protectedRoute.css'

function ProtectedRoute({children}) {
    // assuming user is authenticated if the localstorage have an object with property uid
    const uid = localStorage.getItem('uid');
    if(!uid)
        return <Navigate to='/' />

  return (
    <>
    <Outlet />
    </>
  )
}

export default ProtectedRoute