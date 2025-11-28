// API base URL
const API_URL = 'http://localhost:3000/api';

// Configuración para incluir cookies en las peticiones
const fetchConfig = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json'
  }
};

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'cliente';
  saldo: number;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'cliente';
}

export interface LoginData {
  email: string;
  password: string;
}

// Registrar usuario
export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    ...fetchConfig,
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al registrar usuario');
  }

  return response.json();
};

// Login
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    ...fetchConfig,
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al iniciar sesión');
  }

  return response.json();
};

// Logout
export const logout = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    ...fetchConfig,
    method: 'POST'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cerrar sesión');
  }
};

// Verificar sesión actual
export const checkSession = async (): Promise<{ user: User }> => {
  const response = await fetch(`${API_URL}/auth/check-session`, {
    ...fetchConfig,
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error('No hay sesión activa');
  }

  return response.json();
};

// Cambiar contraseña
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/change-password`, {
    ...fetchConfig,
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al cambiar contraseña');
  }
};

// Recargar saldo del usuario
export interface RechargeData {
  amount: number;
  cardNumber: string;
  cardExp: string;
  cardCvv: string;
}

export interface RechargeResponse {
  message: string;
  previousBalance: string;
  rechargedAmount: string;
  newBalance: string;
  user: User;
}

export const rechargeBalance = async (data: RechargeData): Promise<RechargeResponse> => {
  const response = await fetch(`${API_URL}/users/recharge`, {
    ...fetchConfig,
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al procesar la recarga');
  }

  return response.json();
};
