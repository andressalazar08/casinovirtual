import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../../components/Auth/AuthHeader';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import AuthFooter from '../../components/Auth/AuthFooter';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageAnimation, setPageAnimation] = useState(true);

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageAnimation(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    
    // Simular proceso de login
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', credentials);
      // TODO: Implementar lógica real de autenticación
      // navigate('/dashboard'); // Descomenta cuando tengas el dashboard
    }, 2000);
  };

  const handleRegister = async (userData: { 
    username: string; 
    email: string; 
    password: string; 
    confirmPassword: string 
  }) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      console.log('Register attempt:', userData);
      // TODO: Implementar lógica real de registro
    }, 2000);
  };

  const handleRegisterClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRegister(true);
    }, 1500);
  };

  const handleBackToLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowRegister(false);
    }, 1500);
  };

  return (
    <div className="auth-page-container">
      {/* Animación de carga */}
      {isLoading && (
        <div className="page-transition-animation">
          <div className="transition-loader">
            <div className="transition-spinner"></div>
            <div className="transition-text">
              {showRegister ? 'Cargando registro...' : 'Iniciando sesión...'}
            </div>
          </div>
        </div>
      )}

      {/* Animación de entrada */}
      {pageAnimation && (
        <div className="page-entrance-animation">
          <div className="entrance-content">
            <div className="entrance-logo">🔐</div>
            <div className="entrance-title">CASINO VIRTUAL</div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className={`auth-content ${pageAnimation ? 'content-hidden' : 'content-visible'}`}>
        
        {/* Volver a la página anterior */}
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="auth-card">
          
          {/* Encabezado */}
          <AuthHeader showRegister={showRegister} />

          {/* Formularios */}
          {!showRegister ? (
            <LoginForm 
              onSubmit={handleLogin}
              isLoading={isLoading}
            />
          ) : (
            <RegisterForm 
              onSubmit={handleRegister}
              isLoading={isLoading}
            />
          )}

          {/* Enlaces de registro/volver */}
          <div className="register-section">
            {!showRegister ? (
              <>
                <div className="register-question">¿Quieres registrarte?</div>
                <button 
                  className="register-link"
                  onClick={handleRegisterClick}
                  disabled={isLoading}
                >
                  ¡Regístrate aquí!
                </button>
              </>
            ) : (
              <>
                <div className="register-question">¿Ya tienes cuenta?</div>
                <button 
                  className="register-link"
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                >
                  Volver al login
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <AuthFooter showRegister={showRegister} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;