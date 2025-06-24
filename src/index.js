import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Add React Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/:mobileNumber" element={<App />} />
        <Route path="/" element={<div>Home Page</div>} /> {/* Optional */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();