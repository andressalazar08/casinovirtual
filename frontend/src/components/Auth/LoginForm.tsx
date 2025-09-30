import React, { useState } from 'react';
import { authService, LoginCredentials } from '../../services';
import './LoginForm.css';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    onSubmit({ email, password });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
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
        className="auth-submit-button"
        disabled={!email || !password || isLoading}
      >
        {isLoading ? 'VERIFICANDO...' : 'INGRESAR'}
      </button>
    </form>
  );
};

export default LoginForm;