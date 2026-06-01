import type { ModifyEnrollmentResponse } from '../types';

const API_BASE = '/api/v1/enrollment';

export const modifyEnrollment = async (
  matriculaId: number,
  payload: {
    motivo: string;
    observaciones?: string;
    nuevo_costo_base?: number;
    complementarios?: {
      detalle_id: number;
      nuevo_valor_completo?: number;
    }[];
  },
): Promise<ModifyEnrollmentResponse> => {
  const response = await fetch(`${API_BASE}/students/${matriculaId.toString()}/matricula`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errData = (await response.json().catch(() => ({}))) as { detail?: string };
    throw new Error(errData.detail ?? 'Error al modificar matrícula');
  }
  return response.json() as Promise<ModifyEnrollmentResponse>;
};
