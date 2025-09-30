import apiRequest from './api';
import { User } from './authService';

export interface UpdateUserData {
  username?: string;
  email?: string;
}

/**
 * Servicio de usuarios
 */
export const userService = {
  /**
   * Obtener lista de usuarios activos
   */
  async getUsers(): Promise<User[]> {
    return await apiRequest('/users', {
      method: 'GET',
    });
  },

  /**
   * Actualizar datos del usuario
   */
  async updateUser(id: number, userData: UpdateUserData): Promise<{ message: string; user: User }> {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Desactivar usuario
   */
  async deactivateUser(id: number): Promise<{ message: string }> {
    return await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};