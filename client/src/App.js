import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import Navbar from './components/Navbar';
import Login from './components/Login';

function App() {
  return (
    <div className="App">

      <Router>
        <Navbar/>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<Home/>} />
        </Routes>
      </Router>


    </div>
  );
}

export default App;
