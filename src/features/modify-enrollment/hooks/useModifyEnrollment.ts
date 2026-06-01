import { useState } from 'react';
import { modifyEnrollment } from '../api/modifyApi';

export const useModifyEnrollment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitModification = async (
    matriculaId: number,
    payload: Parameters<typeof modifyEnrollment>[1]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modifyEnrollment(matriculaId, payload);
      return response;
    } catch (err: any) {
      setError(err.message || 'Error al modificar matrícula');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { submitModification, loading, error };
};
