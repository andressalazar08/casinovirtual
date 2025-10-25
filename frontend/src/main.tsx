import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Second_Page from './Second_page';
import Casino from './Casino';
import ModeloAnalisis from './ModeloAnalisis';
import ModeloD_Rachas from './ModeloD_Rachas';

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
        <Route path="/modelo-analisis" element={<ModeloAnalisis />} />
        <Route path="/modelo-d-rachas" element={<ModeloD_Rachas />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);