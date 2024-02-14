import React from 'react'
import './button.css'

function Button({classname, children, onClick}) {
  return (
    <button className={`btn ${classname}`} type={classname==='cancel' ? 'button' : 'submit'} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button