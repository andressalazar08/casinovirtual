import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Second_Page from './Second_page';
import Casino from './Casino'; // Importa Casino

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Ingreso" element={<Second_Page />} />
        <Route path="/casino" element={<Casino />} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);