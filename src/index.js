import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store, {persistor} from './Redux/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReadTodo from './Routes/readTodo/ReadTodo';
import ModifyTodo from './Routes/modifyTodo/ModifyTodo';
import Signin from './Routes/signin/signin';
import Signup from './Routes/signup/signup';
import ProtectedRoute from './protectedRoute/ProtectedRoute';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './components/home/Home';
import AuthWrapper from './HOC/authWrapper/authWrapper'
import Wrapper from './HOC/wrapper/wrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
      <Router >
          <Routes>
            <Route path='/' element={<App />} >
              <Route index element={<Home />} />
              <Route path='readTodo' element={<ProtectedRoute><ReadTodo /></ProtectedRoute> } />
              <Route path='modifyTodo/:id' element={<ProtectedRoute ><Wrapper><ModifyTodo modalType='update' /></Wrapper>  </ProtectedRoute> } />
              <Route path='createTodo' element={<ProtectedRoute ><Wrapper><ModifyTodo modalType='create' /></Wrapper>  </ProtectedRoute> } />
              <Route path='signin' element={<AuthWrapper><Signin /></AuthWrapper>} />
              <Route path='signup' element={<AuthWrapper><Signup /></AuthWrapper>} />

            </Route>
            
          </Routes>
      </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
