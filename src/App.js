import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/navbar';
import Loader from './components/loader/Loader';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

function App() {
  const isLoading = useSelector(state => state.loadingStatus)
  
  return (
    <div className="App">
      <ToastContainer />
      {isLoading && <Loader />}
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
