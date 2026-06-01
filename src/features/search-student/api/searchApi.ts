import type { StudentSearchListResponse } from '../types';

const API_BASE = '/api/v1/enrollment';

export const searchStudents = async (params: {
  documento?: string;
  nombre?: string;
  year?: number;
}): Promise<StudentSearchListResponse> => {
  const query = new URLSearchParams();
  if (params.documento) query.append('documento', params.documento);
  if (params.nombre) query.append('nombre', params.nombre);
  if (params.year) query.append('year', params.year.toString());

  const response = await fetch(`${API_BASE}/students?${query.toString()}`);
  if (!response.ok) throw new Error('Error al buscar estudiantes');
  return response.json() as Promise<StudentSearchListResponse>;
};
