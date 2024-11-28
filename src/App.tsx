import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { EstimatingRides } from './pages/EstimatingRides'
import { ConfirmRide } from './pages/ConfirmRide'
import { GetCustomerRides } from './pages/GetCustomerRides'

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<EstimatingRides />}/>
        <Route path='options' element={<ConfirmRide />}/>
        <Route path='historic'element={<GetCustomerRides />}/>
      </Routes>
    </Router>
  );
};