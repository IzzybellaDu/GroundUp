import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProposalForm from './pages/proposal.tsx'; // Your form component
import LoginForm from './pages/login.tsx';
import RegisterForm from './pages/register.tsx';
import Dashboard from './dashboard.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/old" element={<App></App>}></Route>
      <Route path="/proposal" element={<ProposalForm></ProposalForm>}></Route>
      <Route path="/login" element={<LoginForm></LoginForm>}></Route>
      <Route path="/register" element={<RegisterForm></RegisterForm>}></Route>
      <Route path='/' element={<Dashboard projects={[]} onProjectClick={function (projectId: string): void {
        throw new Error('Function not implemented.');
      } } onVote={function (projectId: string, voteType: 'up' | 'down'): void {
        throw new Error('Function not implemented.');
      } } onCreateClick={function (): void {
        throw new Error('Function not implemented.');
      } }></Dashboard>}></Route>
    </Routes>
  </BrowserRouter>  
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
