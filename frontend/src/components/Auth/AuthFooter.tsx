import React from 'react';
import './AuthFooter.css';

interface AuthFooterProps {
  showRegister: boolean;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ showRegister }) => {
  return (
    <div className="auth-footer">
      <p className="footer-text">
        Al {!showRegister ? 'ingresar' : 'registrarte'} aceptas nuestros{' '}
        <a href="#terms" className="footer-link">Términos y Condiciones</a>
      </p>
    </div>
  );
};

export default AuthFooter;