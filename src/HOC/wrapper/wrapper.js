import React from 'react'
import './wrapper.css'

function Wrapper({children, style}) {
  return (
    <div className='wrapper-style' style={style}>
        {children}
    </div>
  )
}

export default Wrapper