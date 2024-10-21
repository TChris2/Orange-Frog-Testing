import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Admin from './components/Admin';  // Import the Admin component
import PasswordReset from './components/PasswordReset';

function App() {
  return (
    <div className="App">
      <Toaster richColors/>

      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/admin" element={<Admin/>} />  
          <Route path="/reset-password" element={<PasswordReset/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
