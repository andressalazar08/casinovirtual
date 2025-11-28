import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { register } from './services/authService';
import './Second_page.css';

const Second_Page: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin, isAuthenticated } = useAuth();
  
  // Estados para login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados para registro
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageAnimation, setPageAnimation] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageAnimation(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/casino');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setIsLoading(true);
    
    try {
      await authLogin(email, password);
      navigate('/casino');
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!registerUsername || !registerEmail || !registerPassword || !registerPasswordConfirm) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    if (registerPassword !== registerPasswordConfirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (registerPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      await register({
        username: registerUsername,
        email: registerEmail,
        password: registerPassword,
        role: 'cliente' // Por defecto se registran como cliente
      });
      
      setSuccess('Usuario registrado exitosamente. Ahora puede iniciar sesión.');
      setTimeout(() => {
        setShowRegister(false);
        setEmail(registerEmail);
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Error al registrar usuario');
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
    <div className="second-page-container">
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

      {pageAnimation && (
        <div className="page-entrance-animation">
          <div className="entrance-content">
            <div className="entrance-logo">🔐</div>
            <div className="entrance-title">CASINO VIRTUAL</div>
          </div>
        </div>
      )}

      <div className={`login-content ${pageAnimation ? 'content-hidden' : 'content-visible'}`}>
        
        <button 
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        <div className="login-card">
          
          <div className="login-header">
            <div className="login-icon">🎰</div>
            <h1 className="login-title">
              {!showRegister ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
            </h1>
            <p className="login-subtitle">
              {!showRegister ? 'Accede a tu cuenta del casino' : 'Crea tu nueva cuenta'}
            </p>
          </div>

          {error && (
            <div style={{
              background: '#ff5252',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#4caf50',
              color: 'white',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {success}
            </div>
          )}

          {!showRegister ? (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu email"
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
                disabled={!email || !password || isLoading}
              >
                {isLoading ? 'VERIFICANDO...' : 'INGRESAR'}
              </button>
            </form>
          ) : (
            <form className="login-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="new-username" className="form-label">
                  USUARIO
                </label>
                <input
                  type="text"
                  id="new-username"
                  className="form-input"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  placeholder="Crea tu usuario"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-email" className="form-label">
                  EMAIL
                </label>
                <input
                  type="email"
                  id="register-email"
                  className="form-input"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
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
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
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
                  value={registerPasswordConfirm}
                  onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                  className="form-input"
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="register-submit-button"
                disabled={!registerUsername || !registerEmail || !registerPassword || !registerPasswordConfirm || isLoading}
              >
                {isLoading ? 'REGISTRANDO...' : 'REGISTRARSE'}
              </button>
            </form>
          )}

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