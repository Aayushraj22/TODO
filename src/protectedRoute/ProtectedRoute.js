import React from 'react'
import {Navigate} from 'react-router-dom'
import './protectedRoute.css'

function ProtectedRoute({children}) {
    // assuming user is authenticated if the localstorage have an object with property uid
    const uid = localStorage.getItem('uid');
    if(!uid)
        return <Navigate to='/' />

  return (
    <>
    {children}
    </>
  )
}

export default ProtectedRoute