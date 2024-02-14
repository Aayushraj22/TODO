import React from 'react'
import './authWrapper.css'

function AuthWrapper({children}) {
  return (
    <div className='authWrapper-container'>
        {children}
    </div>
  )
}

export default AuthWrapper