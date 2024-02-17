import React from 'react'
import './signup.css'
import Button from '../../components/button/Button';
import { useNavigate } from 'react-router-dom';


function Signup() {
    const navigate = useNavigate();

  function handleClosesignup(){
    return navigate('/')
  }

  function handleGoToSignin() {
    return navigate('/signin')
  }

  function handleToOpenEmailWindow(){
    navigate('/withEmail', {state: {formType: 'signup'}});
}


return (
<div className='signup-container'>
    
    <div className="icons">
        <i className="fa-solid fa-xmark" onClick={handleClosesignup}></i>
    </div>
    <div className="text-body">
        Join Us.
    </div>

    <div className="several-links">
        <Button onClick={handleToOpenEmailWindow} >
            <span >
                <i className="fa-solid fa-envelope" style={{marginRight: '1rem'}}></i>
                SignUp with Email
            </span>
        </Button>

    </div>

    <div className='msg-text'>
    Already have an account? &nbsp; 
        <span onClick={handleGoToSignin}>signin</span>
    </div>
</div>
)
}

export default Signup