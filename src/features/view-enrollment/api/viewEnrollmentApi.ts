import type { StudentBalance } from '@/entities/student/model/types';

const API_BASE = '/api/v1/enrollment';

export const getStudentBalance = async (
  studentId: number,
  year: number = new Date().getFullYear(),
): Promise<StudentBalance> => {
  const response = await fetch(
    `${API_BASE}/students/${studentId.toString()}/balance?year=${year.toString()}`,
  );
  if (!response.ok) throw new Error('Error al obtener balance');
  return response.json() as Promise<StudentBalance>;
};
