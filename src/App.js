import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/navbar';
import Loader from './components/loader/Loader';
import { useSelector } from 'react-redux';
import { Flip, ToastContainer, Zoom } from 'react-toastify';

function App() {
  const isLoading = useSelector(state => state.loadingStatus)
  
  return (
    <div className="App">
      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        transition={Flip}
        theme="light"
      />
      {isLoading && <Loader />}
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
