import React from 'react'
import './navbar.css'
import Button from '../button/Button'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {isAuthenticUser} from '../../Redux/slice/authslice';
import { toast } from 'react-toastify';

function Navbar() {
  const selector = useSelector(state => state.persistedReducer.authenticUser)

  const navigate = useNavigate();
  const dispatch = useDispatch();

    function handleShowAuthWindow(text){
        return navigate(`/${text}`)
    }

    function handleToLogout() {
      localStorage.removeItem('uid');
      dispatch(isAuthenticUser(false))
      toast.success('Logout Successfully');
      navigate('/', {replace: 'true'});
    }


  return (
    <>
      <div className="navbar">
          <span style={{fontSize: '2rem', fontWeight: '600', letterSpacing: '0.4rem' }}>Todo</span>
          <div className="authLinks">
            {selector ? <Button onClick={handleToLogout}>Logout </Button> : (<>
              <Button onClick={() => handleShowAuthWindow('signin')}>signin</Button>
              <Button onClick={() => handleShowAuthWindow('signup')}>signup</Button>
            </>)}
                
          </div>
      </div>
    </>
  )
}

export default Navbar