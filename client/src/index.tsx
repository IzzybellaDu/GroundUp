import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProposalForm from './pages/proposal.tsx'; // Your form component
import ProjectPage from './pages/projectPage.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/proposal" element={<ProposalForm></ProposalForm>}></Route>
            <Route path="/projectpage" element={<ProjectPage></ProjectPage>}></Route>
    </Routes>
  </BrowserRouter>  
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
