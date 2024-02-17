import React, {useEffect} from 'react'
import './home.css'
import Header from '../Header'
import Wrapper from '../../HOC/wrapper/wrapper'
import TodoListContainer from '../todoListContainer/TodoListContainer';
import { useSelector } from 'react-redux';

function Home() {
    const isAuthenticated = useSelector(state => state.persistedReducer.authenticUser)
    useEffect(() => {
      // something will be done here
    }, [isAuthenticated])
    
    // const bgColor = ;
  return (
    <>
        <Wrapper style={{background: 'white'}}>
            <Header />
        </Wrapper>
        {isAuthenticated && <Wrapper style={{background: 'whitesmoke'}}>
                    <TodoListContainer />
                </Wrapper>
        }
    </>
  )
}

export default Home