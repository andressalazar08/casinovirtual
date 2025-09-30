// Exportar todos los servicios
export { authService } from './authService';
export { slotService } from './slotService';
export { userService } from './userService';
export { default as apiRequest } from './api';

// Re-exportar tipos importantes
export type {
  LoginCredentials,
  RegisterData,
  User,
  AuthResponse,
} from './authService';

export type {
  SpinRequest,
  SpinResult,
  SlotSpin,
  Balance,
} from './slotService';

export type {
  UpdateUserData,
} from './userService';