export interface LoginPayload {
  username: string;
  contrasenia: string;
}

export interface LoginUser {
  id: number;
  username: string;
  rol: 'Administración' | 'Rectoría' | 'Tesorería' | 'Docente';
  estado: boolean;
}

export interface LoginResponse {
  mensaje: string;
  usuario: LoginUser;
  token: string;
}

const API_BASE = '/api/v1/auth';

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = (await response.json().catch(() => ({}))) as { detail?: string };
      throw new Error(errData.detail ?? 'Error al iniciar sesión');
    }

    return response.json() as Promise<LoginResponse>;
  },
};
