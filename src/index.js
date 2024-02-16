import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store, { persistor } from './Redux/store';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ReadTodo from './Routes/readTodo/ReadTodo';
import ModifyTodo from './Routes/modifyTodo/ModifyTodo';
import Signin from './Routes/signin/signin';
import Signup from './Routes/signup/signup';
import ProtectedRoute from './protectedRoute/ProtectedRoute';
import { PersistGate } from 'redux-persist/integration/react';
import Home from './components/home/Home';
import AuthWrapper from './HOC/authWrapper/authWrapper'
import Wrapper from './HOC/wrapper/wrapper';
import Form from './components/form/form';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index element={<Home />} />
      <Route element={<ProtectedRoute />}>
        <Route path='readTodo' element={<ReadTodo />} />
        <Route path='modifyTodo/:id' element={<Wrapper><ModifyTodo modalType='update' /></Wrapper>} />
        <Route path='createTodo' element={<Wrapper><ModifyTodo modalType='create' /></Wrapper>} />
      </Route>
      
      <Route element={<AuthWrapper />}>
        <Route path='signin' element={<Signin />} /> 
        <Route path='signup' element={<Signup />} /> 
        <Route path='withEmail' element={<Form />} />
      </Route>

    </Route>
  )
)



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor} >
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
