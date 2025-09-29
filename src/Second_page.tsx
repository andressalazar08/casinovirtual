import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Second_page.css';

const Second_Page: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    
    // Simular proceso de login
    setTimeout(() => {
      setIsLoading(false);
      // Aquí iría la lógica real de autenticación
      console.log('Login attempt:', { username, password });
      // navigate('/dashboard'); // Descomenta cuando tengas el dashboard
    }, 2000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de registro aquí
    console.log('Register attempt');
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
    <div className="second-page-container">
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
      <div className={`login-content ${pageAnimation ? 'content-hidden' : 'content-visible'}`}>
        
        {/* Volver a la página anterior */}
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="login-card">
          
          {/* Encabezado */}
          <div className="login-header">
            <div className="login-icon">🎰</div>
            <h1 className="login-title">
              {!showRegister ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
            </h1>
            <p className="login-subtitle">
              {!showRegister ? 'Accede a tu cuenta del casino' : 'Crea tu nueva cuenta'}
            </p>
          </div>

          {!showRegister ? (
            /* Formulario de Login */
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  USUARIO
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  CONTRASEÑA
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-submit-button"
                disabled={!username || !password || isLoading}
              >
                {isLoading ? 'VERIFICANDO...' : 'INGRESAR'}
              </button>
            </form>
          ) : (
            /* Formulario de Registro - TEXTO CORREGIDO */
            <form className="login-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="new-username" className="form-label">
                  NUEVO USUARIO
                </label>
                <input
                  type="text"
                  id="new-username"
                  className="form-input"
                  placeholder="Crea tu usuario"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="tu@gmail.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-password" className="form-label">
                  CONTRASEÑA
                </label>
                <input
                  type="password"
                  id="new-password"
                  className="form-input"
                  placeholder="Crea tu contraseña"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">
                  CONFIRMAR CONTRASEÑA
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="form-input"
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="register-submit-button"
              >
                REGISTRARSE
              </button>
            </form>
          )}

          {/* Enlace de registro/volver - TEXTO CORREGIDO */}
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

          {/* Información adicional - TEXTO CORREGIDO */}
          <div className="login-footer">
            <p className="footer-text">
              Al {!showRegister ? 'ingresar' : 'registrarte'} aceptas nuestros{' '}
              <a href="#terms" className="footer-link">Términos y Condiciones</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Second_Page;