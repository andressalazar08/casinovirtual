// API base URL
const API_URL = 'http://localhost:3000/api';

// Configuración para incluir cookies en las peticiones
const fetchConfig = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json'
  }
};

export interface SymbolConfig {
  id?: number;
  symbolId: string;
  symbolName?: string;
  nombre?: string;
  emoji: string;
  probability?: number;
  probabilidad?: number;
  multiplier?: number;
  multiplicador?: number;
  type?: string;
  tipo?: string;
  active?: boolean;
}

export interface ModelAConfig {
  symbols: SymbolConfig[];
  rtpTarget: number;
}

export interface SaveConfigResponse {
  message: string;
  success: boolean;
}

// Obtener configuración del Modelo A
export const getModelAConfig = async (): Promise<ModelAConfig> => {
  const response = await fetch(`${API_URL}/model-config/modelo-a`, fetchConfig);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener configuración del Modelo A');
  }

  return response.json();
};

// Guardar configuración del Modelo A
export const saveModelAConfig = async (config: ModelAConfig): Promise<SaveConfigResponse> => {
  const response = await fetch(`${API_URL}/model-config/modelo-a`, {
    ...fetchConfig,
    method: 'POST',
    body: JSON.stringify(config)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al guardar configuración del Modelo A');
  }

  return response.json();
};

// Obtener configuración activa para el juego
export const getActiveGameConfig = async (): Promise<ModelAConfig> => {
  const response = await fetch(`${API_URL}/model-config/active`, fetchConfig);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error al obtener configuración activa');
  }

  return response.json();
};
