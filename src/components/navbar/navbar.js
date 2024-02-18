import React from 'react'
import './navbar.css'
import Button from '../button/Button'
import { useDispatch, useSelector } from 'react-redux';
import { dark, light } from '../../Redux/themeSlice';
import { useNavigate } from 'react-router-dom';
import {isAuthenticUser} from '../../Redux/authslice';
import { toast } from 'react-toastify';

function Navbar() {
  const selector = useSelector(state => state.persistedReducer.authenticUser)
  // console.log('authuser 123: ',selector)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.persistedReducer.themeChanger)

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
              
              
              {/* <Button onClick={() => {
                if(theme.color === 'white'){
                  dispatch(light())
                }else{
                  dispatch(dark())
                }
              }}>{theme.color==='white' ? 'Light' : 'Dark'}</Button> */}
          </div>
      </div>
    </>
  )
}

export default Navbar