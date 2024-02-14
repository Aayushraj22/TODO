import React from 'react'
import './signin.css'
import Button from '../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import Form from '../../components/form/form';

function Signin() {
    const navigate = useNavigate();

    function handleCloseSignIn(){
        // const signinWrapper = document.querySelectorAll('.authWrapper-container')[0];
        // signinWrapper.classList.remove('isOpen')

        return navigate('/');
    }

    function handleGoToSignup(){
        // handleCloseSignIn();
        // const signupWrapper = document.querySelectorAll('.authWrapper-container')[1];
        // signupWrapper.classList.add('isOpen')

        return navigate('/signup');
    }

    function handleOpenEmailWindow(){
        const formElement = document.querySelector('.form-container')
        formElement.classList.add('isOpenZ4')
    }

  return (
    <div className='signin-container'>
        <Form formType='signin' />
        <div className="icons">
            <i className="fa-solid fa-xmark" onClick={handleCloseSignIn}></i>
        </div>
        <div className="text-body">
            Welcome Back.
        </div>

        <div className="several-links">
            <Button >
                <span >
                    <i className="fa-brands fa-google " style={{marginRight: '1rem'}}></i>
                    SignIn with Google
                </span>
            </Button>
            <Button onClick={handleOpenEmailWindow}>
                <span >
                    <i className="fa-solid fa-envelope" style={{marginRight: '1rem'}}></i>
                    SignIn with Email
                </span>
            </Button>

        </div>

        <div className='msg-text'>
            No Account? &nbsp; 
            <span onClick={handleGoToSignup}>Create One</span>
        </div>
    </div>
  )
}

export default Signin