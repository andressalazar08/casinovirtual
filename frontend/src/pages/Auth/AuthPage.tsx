import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../../components/Auth/AuthHeader';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import AuthFooter from '../../components/Auth/AuthFooter';
import { authService, LoginCredentials, RegisterData } from '../../services';
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

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(credentials);
      console.log('Login exitoso:', response);
      // Guardar información del usuario si es necesario
      localStorage.setItem('user', JSON.stringify(response.user));
      // Redirigir al home después del login exitoso
      navigate('/');
    } catch (error) {
      console.error('Error en login:', error);
      alert(`Error al iniciar sesión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: RegisterData & { confirmPassword: string }) => {
    setIsLoading(true);
    
    try {
      // Validar que las contraseñas coincidan
      if (userData.password !== userData.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }

      // Extraer solo los datos necesarios para el registro
      const { username, email, password } = userData;
      const response = await authService.register({ username, email, password });
      
      console.log('Registro exitoso:', response);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
      // Cambiar a la vista de login
      setShowRegister(false);
    } catch (error) {
      console.error('Error en registro:', error);
      alert(`Error al registrarse: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
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