import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

function App() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        🎰 Cargando...
      </div>
    );
  }

  // Página de bienvenida
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '64px', marginBottom: '20px', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}>
        🎰 Casino Virtual 🎰
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '40px', color: '#ffd700' }}>
        ¡Bienvenido al mejor casino online!
      </p>
      
      {isAuthenticated ? (
        <button 
          onClick={() => navigate('/casino')}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            background: 'linear-gradient(145deg, #d4af37, #b8941f)',
            border: '3px solid #ffd700',
            borderRadius: '12px',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(255,215,0,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.5)';
          }}
        >
          🎮 JUGAR AHORA
        </button>
      ) : (
        <button 
          onClick={() => navigate('/Ingreso')}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            background: 'linear-gradient(145deg, #d4af37, #b8941f)',
            border: '3px solid #ffd700',
            borderRadius: '12px',
            color: '#000',
            cursor: 'pointer',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(255,215,0,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.5)';
          }}
        >
          🔐 INICIAR SESIÓN
        </button>
      )}
    </div>
  );
}

export default App;
