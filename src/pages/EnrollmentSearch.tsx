import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { enrollmentApi } from '../api/enrollment';
import type { StudentSearchItem } from '../api/enrollment';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';

export const EnrollmentSearch: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ documento: '', nombre: '', date: '' });
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  // Fetch initial data
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await enrollmentApi.searchStudents({
        documento: filters.documento,
        nombre: filters.nombre
      });
      // The backend returns { estudiantes: [...], total_resultados: X } or just the array depending on the API. 
      // Based on the schema StudentSearchListResponse, it's an object with `estudiantes` array.
      if (data.estudiantes) {
        setStudents(data.estudiantes);
      } else if (Array.isArray(data)) {
        setStudents(data);
      } else {
        setStudents([]);
      }
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManage = () => {
    if (selectedStudent) {
      navigate(`/student/${selectedStudent}/enrollment`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Módulo de Matrícula</h2>
        <p style={{ color: 'var(--text-muted)' }}>Gestión de matrículas y pagos</p>
      </div>

      <div className="card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '16px' }}>
          <Search size={20} /> Filtros de búsqueda
        </h3>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', marginBottom: '16px', color: '#166534', fontSize: '0.875rem' }}>
          Ingrese el código o nombre del estudiante y seleccione una fecha para iniciar la búsqueda
        </div>
        
        <form onSubmit={handleSearch}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
            <Input 
              label="Código" 
              placeholder="Ej. 123123" 
              value={filters.documento}
              onChange={e => setFilters({...filters, documento: e.target.value})}
            />
            <Input 
              label="Nombre" 
              placeholder="Ej. Juan" 
              value={filters.nombre}
              onChange={e => setFilters({...filters, nombre: e.target.value})}
            />
            <Input 
              label="Fecha" 
              type="date"
              value={filters.date}
              onChange={e => setFilters({...filters, date: e.target.value})}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="primary" style={{ backgroundColor: '#7f1d1d' }} disabled={loading}>
                <Search size={16} style={{ marginRight: '8px' }} />
                Buscar
              </Button>
            </div>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Grado</th>
              <th>Período</th>
              <th>Estado</th>
              <th>Pagos Realizados</th>
              <th>Saldo Pendiente</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center' }}>Cargando...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center' }}>No se encontraron resultados</td></tr>
            ) : (
              students.map(student => (
                <tr key={student.estudiante_id} onClick={() => setSelectedStudent(student.estudiante_id)} style={{ cursor: 'pointer' }}>
                  <td>
                    <input 
                      type="radio" 
                      name="studentSelect" 
                      checked={selectedStudent === student.estudiante_id}
                      onChange={() => setSelectedStudent(student.estudiante_id)}
                      style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#1d4ed8' }}
                    />
                  </td>
                  <td>{student.documento}</td>
                  <td style={{ fontWeight: 500 }}>{student.nombre}</td>
                  <td>{student.grado_nombre}</td>
                  <td>{student.anio}</td>
                  <td>
                    <StatusBadge status={student.estado_matricula} />
                  </td>
                  <td>{student.pagos_realizados}</td>
                  <td style={{ fontWeight: 600 }}>${student.saldo_pendiente.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#1e3a8a', margin: 0 }}>
            Ha seleccionado un estudiante. Puede continuar con la gestión de matrícula.
          </p>
          <Button onClick={handleManage} variant="primary">
            Gestionar
          </Button>
        </div>
      )}
    </div>
  );
};
