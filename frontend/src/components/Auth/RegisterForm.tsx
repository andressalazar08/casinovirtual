import React, { useState } from 'react';
import './RegisterForm.css';

interface RegisterFormProps {
  onSubmit: (userData: { 
    username: string; 
    email: string; 
    password: string; 
    confirmPassword: string;
  }) => void;
  isLoading: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    onSubmit({ username, email, password, confirmPassword });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="new-username" className="form-label">
          NUEVO USUARIO
        </label>
        <input
          type="text"
          id="new-username"
          className="form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repite tu contraseña"
          required
        />
      </div>

      <button 
        type="submit" 
        className="auth-submit-button register-submit-button"
        disabled={!username || !email || !password || !confirmPassword || isLoading}
      >
        {isLoading ? 'REGISTRANDO...' : 'REGISTRARSE'}
      </button>
    </form>
  );
};

export default RegisterForm;