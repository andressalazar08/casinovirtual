import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App';
import Second_Page from './Second_page';
import Casino from './Casino';
import ModeloAnalisis from './ModeloAnalisis';
import ModeloD_Rachas from './ModeloD_Rachas';
import AdminModeloA from './AdminModeloA';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/Ingreso" element={<Second_Page />} />
          
          {/* Rutas protegidas para clientes y admin */}
          <Route 
            path="/casino" 
            element={
              <ErrorBoundary>
                <ProtectedRoute>
                  <Casino />
                </ProtectedRoute>
              </ErrorBoundary>
            } 
          />
          
          {/* Rutas protegidas solo para admin */}
          <Route 
            path="/modelo-analisis" 
            element={
              <ErrorBoundary>
                <ProtectedRoute requiredRole="admin">
                  <ModeloAnalisis />
                </ProtectedRoute>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/modelo-d-rachas" 
            element={
              <ErrorBoundary>
                <ProtectedRoute requiredRole="admin">
                  <ModeloD_Rachas />
                </ProtectedRoute>
              </ErrorBoundary>
            } 
          />
          <Route 
            path="/admin-modelo-a" 
            element={
              <ErrorBoundary>
                <ProtectedRoute requiredRole="admin">
                  <AdminModeloA />
                </ProtectedRoute>
              </ErrorBoundary>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);