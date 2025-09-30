import apiRequest from './api';

// Tipos para el slot machine
export interface SpinRequest {
  betAmount: number;
}

export interface SpinResult {
  reels: string[][];
  win: boolean;
  payout: number;
  saldo: number;
  winSymbol?: string;
}

export interface SlotSpin {
  id: number;
  betAmount: number;
  resultSymbols: string;
  winAmount: number;
  createdAt: string;
}

export interface Balance {
  saldo: number;
}

/**
 * Servicio del slot machine
 */
export const slotService = {
  /**
   * Realizar un giro de la tragamonedas
   */
  async spin(betAmount: number): Promise<SpinResult> {
    return await apiRequest('/slots/spin', {
      method: 'POST',
      body: JSON.stringify({ betAmount }),
    });
  },

  /**
   * Obtener historial de jugadas
   */
  async getHistory(): Promise<SlotSpin[]> {
    return await apiRequest('/slots/history', {
      method: 'GET',
    });
  },

  /**
   * Obtener saldo actual
   */
  async getBalance(): Promise<Balance> {
    return await apiRequest('/slots/balance', {
      method: 'GET',
    });
  },

  /**
   * Obtener símbolos disponibles
   */
  async getSymbols(): Promise<any[]> {
    return await apiRequest('/slots/symbols', {
      method: 'GET',
    });
  },
};