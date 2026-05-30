import React, { useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/atoms/Button';
import { Input } from '../../../shared/ui/atoms/Input';
import { enrollmentApi } from '../../../entities/student/api/enrollment';

interface ManualEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (studentId: number) => void;
}

const GRADES = [
  'Preescolar',
  'Primero',
  'Segundo',
  'Tercero',
  'Cuarto',
  'Quinto',
  'Sexto',
  'Séptimo',
  'Octavo',
  'Noveno',
  'Décimo',
  'Once'
];

export const ManualEnrollmentModal: React.FC<ManualEnrollmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [documento, setDocumento] = useState('');
  const [nombre, setNombre] = useState('');
  const [grado, setGrado] = useState(GRADES[0]);
  const [nombreAcudiente, setNombreAcudiente] = useState('');
  const [periodoId, setPeriodoId] = useState(1);
  const [anio, setAnio] = useState(() => new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Submit manual enrollment
      await enrollmentApi.manualEnrollment({
        documento: documento.trim(),
        nombre: nombre.trim(),
        grado,
        nombre_acudiente: nombreAcudiente.trim(),
        periodo_id: periodoId,
        anio: anio
      });

      // 2. Fetch the newly created student by document to get their student ID
      const searchRes = await enrollmentApi.searchStudents({
        documento: documento.trim(),
        year: anio
      });

      const matchedStudent = searchRes.estudiantes.find(
        (s) => s.documento.trim() === documento.trim()
      );

      if (matchedStudent) {
        onSuccess(matchedStudent.estudiante_id);
      } else {
        // Fallback: if we can't find them by exact document, try partial match or just alert
        if (searchRes.estudiantes.length > 0) {
          onSuccess(searchRes.estudiantes[0].estudiante_id);
        } else {
          throw new Error('Estudiante matriculado, pero no se pudo encontrar en la base de datos para redirección.');
        }
      }
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Ocurrió un error inesperado al matricular al estudiante.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Matrícula Manual Individual" width={520}>
      <form onSubmit={(e) => { void handleSubmit(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'var(--status-red-bg)', color: 'var(--status-red)', fontSize: '0.875rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <Input
          label="Documento de Identidad *"
          placeholder="Ej: 100293847"
          required
          value={documento}
          onChange={(e) => { setDocumento(e.target.value); }}
          disabled={loading}
        />

        <Input
          label="Nombre Completo del Estudiante *"
          placeholder="Ej: Juan Sebastián Pérez López"
          required
          value={nombre}
          onChange={(e) => { setNombre(e.target.value); }}
          disabled={loading}
        />

        <div className="input-container">
          <label className="input-label">Grado *</label>
          <select
            value={grado}
            onChange={(e) => { setGrado(e.target.value); }}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--border)',
              backgroundColor: '#fff',
              fontSize: '1rem',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'border-color 0.2s',
              cursor: 'pointer'
            }}
          >
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Nombre del Acudiente *"
          placeholder="Ej: María Clara López (Madre)"
          required
          value={nombreAcudiente}
          onChange={(e) => { setNombreAcudiente(e.target.value); }}
          disabled={loading}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="input-container">
            <label className="input-label">Periodo Académico *</label>
            <select
              value={periodoId}
              onChange={(e) => { setPeriodoId(Number(e.target.value)); }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--border)',
                backgroundColor: '#fff',
                fontSize: '1rem',
                color: 'var(--text-main)',
                outline: 'none',
                transition: 'border-color 0.2s',
                cursor: 'pointer'
              }}
            >
              {[1, 2, 3, 4].map((p) => (
                <option key={p} value={p}>
                  Periodo {p}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Año Lectivo *"
            type="number"
            required
            value={anio}
            onChange={(e) => { setAnio(Number(e.target.value)); }}
            disabled={loading}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Matriculando...' : 'Matricular Estudiante'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
