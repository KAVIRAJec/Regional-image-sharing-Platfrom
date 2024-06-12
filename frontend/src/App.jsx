import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import Login from './Auth/Login';
import Register from './Auth/Register';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './pages/home';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const App = ({ Component, pageProps }) => {
  const { isAuthenticated } = useAuth();

  return(
    <PrimeReactProvider>
     <Router>
    <Routes>
      <Route 
        path="/" 
        element={!isAuthenticated ? <Register /> : <Navigate to="/home" />}
      />
      <Route 
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/home" />}
        />
      <Route 
        path="/home"
        element={isAuthenticated ? <Home /> : <Login />}
      />
    </Routes>
  </Router>
  </PrimeReactProvider>
  );
};

export default App
