import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProposalForm from './pages/proposal.tsx'; // Your form component
import LoginForm from './pages/login.tsx';
import RegisterForm from './pages/register.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/proposal" element={<ProposalForm></ProposalForm>}></Route>
      <Route path="/login" element={<LoginForm></LoginForm>}></Route>
      <Route path="/register" element={<RegisterForm></RegisterForm>}></Route>
    </Routes>
  </BrowserRouter>  
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
