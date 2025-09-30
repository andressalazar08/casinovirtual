import React from 'react';
import './AuthHeader.css';

interface AuthHeaderProps {
  showRegister: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ showRegister }) => {
  return (
    <div className="auth-header">
      <div className="auth-icon">🎰</div>
      <h1 className="auth-title">
        {!showRegister ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
      </h1>
      <p className="auth-subtitle">
        {!showRegister ? 'Accede a tu cuenta del casino' : 'Crea tu nueva cuenta'}
      </p>
    </div>
  );
};

export default AuthHeader;