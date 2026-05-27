import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, FileText, DollarSign, Check, Edit, AlertTriangle } from 'lucide-react';
import { enrollmentApi } from '../entities/student/api/enrollment';
import type { StudentBalance } from '../entities/student/api/enrollment';
import { Button } from '../shared/ui/atoms/Button';
import { Input } from '../shared/ui/atoms/Input';
import { StatusBadge } from '../shared/ui/atoms/StatusBadge';
import { Modal } from '../shared/ui/molecules/Modal';

export const EnrollmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<StudentBalance | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Payment states
  const [receiptNumber, setReceiptNumber] = useState('');
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>({});
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editConcept, setEditConcept] = useState<{ id: string, name: string, currentVal: number, detalleId?: number } | null>(null);
  const [newVal, setNewVal] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editObs, setEditObs] = useState('');

  const fetchBalance = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await enrollmentApi.getStudentBalance(Number(id));
      setBalance(data);
      
      // Inicializar montos a pagar con el total de la deuda por concepto
      const initialAmounts: Record<string, string> = {};
      if (data.pendiente_base > 0) {
        initialAmounts.matricula_base = data.pendiente_base.toString();
      }
      data.complementarios.forEach(c => {
        if (c.valor_pendiente > 0) {
          initialAmounts[`comp_${c.complementario_id.toString()}`] = c.valor_pendiente.toString();
        }
      });
      setPaymentAmounts(initialAmounts);

    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchBalance();
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, [fetchBalance]);

  const handleAmountChange = (key: string, val: string) => {
    setPaymentAmounts(prev => ({ ...prev, [key]: val }));
  };

  const handlePayment = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!balance || !receiptNumber) return;

    try {
      setPaymentLoading(true);
      
      const asignaciones = [];
      for (const key in paymentAmounts) {
        const monto = Number(paymentAmounts[key]);
        if (monto > 0) {
          if (key === 'matricula_base') {
            asignaciones.push({ concepto: 'matricula_base', monto });
          } else if (key.startsWith('comp_')) {
            const compId = Number(key.split('_')[1]);
            asignaciones.push({ concepto: 'complementario', complementario_id: compId, monto });
          }
        }
      }

      if (asignaciones.length === 0) {
        alert("Debe ingresar al menos un monto para pagar.");
        setPaymentLoading(false);
        return;
      }

      const matriculaId = balance.matricula_id ?? balance.estudiante.id;

      await enrollmentApi.registerDirectedPayment({
        matricula_id: matriculaId,
        asignaciones,
        codigo_talonario: receiptNumber,
        observacion: 'Pago registrado desde portal administrativo'
      });

      setReceiptNumber('');
      await fetchBalance();
      alert("Pago registrado exitosamente");

    } catch (error) {
      console.error('Error registering payment:', error);
      alert("Error al registrar pago. Por favor revise el log.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const openEditModal = (conceptId: string, name: string, currentVal: number, detalleId?: number) => {
    setEditConcept({ id: conceptId, name, currentVal, detalleId });
    setNewVal('');
    setEditReason('');
    setEditObs('');
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!balance || !editConcept || !newVal) return;

    const matriculaId = balance.matricula_id ?? balance.estudiante.id;

    try {
      const parsedValue = parseInt(newVal, 10);
      if (isNaN(parsedValue) || parsedValue < 0) {
        alert("El valor debe ser un número entero mayor o igual a 0.");
        return;
      }

      const payload: {
        motivo: string;
        observaciones?: string;
        nuevo_costo_base?: number;
        complementarios?: {
          detalle_id: number;
          nuevo_valor_completo?: number;
        }[];
      } = {
        motivo: editReason,
        observaciones: editObs ? editObs : undefined,
      };

      if (editConcept.id === 'matricula_base') {
        payload.nuevo_costo_base = parsedValue;
      } else if (editConcept.detalleId !== undefined) {
        payload.complementarios = [
          {
            detalle_id: editConcept.detalleId,
            nuevo_valor_completo: parsedValue,
          }
        ];
      } else {
        alert("Concepto inválido para edición");
        return;
      }

      await enrollmentApi.modifyEnrollment(matriculaId, payload);
      
      setIsEditModalOpen(false);
      await fetchBalance();
      alert("Edición registrada exitosamente");
    } catch (error: unknown) {
      console.error('Error modifying enrollment:', error);
      const errMsg = error instanceof Error ? error.message : "Error al modificar matrícula. Por favor revise el log.";
      alert(errMsg);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando información del estudiante...</div>;
  }

  if (!balance) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>No se pudo cargar la información.</div>;
  }

  // Elementos con deuda
  const debtItems = [];
  if (balance.pendiente_base > 0) {
    debtItems.push({ id: 'matricula_base', label: 'Matrícula Base', max: balance.pendiente_base });
  }
  balance.complementarios.forEach(c => {
    if (c.valor_pendiente > 0) {
      debtItems.push({ id: `comp_${c.complementario_id.toString()}`, label: c.tipo_complementario, max: c.valor_pendiente });
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header and navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <button onClick={() => { void navigate(-1); }} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
          <ArrowLeft size={16} /> Volver a búsqueda
        </button>
        <Button variant="outline" size="sm">
          Ver Historial de Auditoría
        </Button>
      </div>

      {/* Student Info Card */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <User size={24} color="var(--text-muted)" />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{balance.estudiante.nombre}</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Código</p>
            <p style={{ fontWeight: 500 }}>{balance.estudiante.documento}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grado</p>
            <p style={{ fontWeight: 500 }}>{balance.estudiante.grado_nombre}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Período</p>
            <p style={{ fontWeight: 500 }}>{balance.anio.toString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pagos Realizados</p>
            <p style={{ fontWeight: 500 }}>{balance.pagos_realizados.toString()}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estado Actual</p>
            <StatusBadge status={balance.estado_matricula} />
          </div>
        </div>
      </div>

      {/* Conceptos Económicos */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc' }}>
          <FileText size={20} color="var(--text-muted)" />
          <h3 style={{ margin: 0, fontSize: '1rem' }}>Conceptos Económicos Parametrizados</h3>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>Matrícula Base</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Valor base</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>${balance.costo_base_matricula.toLocaleString()}</p>
              <button 
                onClick={() => { openEditModal('matricula_base', 'Matrícula Base', balance.costo_base_matricula); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }}
              >
                <Edit size={18} />
              </button>
            </div>
          </div>

          {balance.complementarios.map(comp => (
             <div key={comp.detalle_id.toString()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border)', borderRadius: '8px', background: '#fff' }}>
             <div>
               <p style={{ fontWeight: 600, margin: 0 }}>{comp.tipo_complementario}</p>
               <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>Concepto complementario</p>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <p style={{ fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>${comp.valor_completo.toLocaleString()}</p>
                <button 
                  onClick={() => { openEditModal(`comp_${comp.complementario_id.toString()}`, comp.tipo_complementario, comp.valor_completo, comp.detalle_id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }}
                >
                  <Edit size={18} />
                </button>
              </div>
           </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '8px', background: '#eff6ff', border: '1px solid #bfdbfe', marginTop: '8px' }}>
            <p style={{ fontWeight: 700, margin: 0, color: '#1e3a8a' }}>Total Matrícula</p>
            <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0, color: '#1d4ed8' }}>${balance.costo_total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Saldo Pendiente */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderRadius: '8px', background: '#fefce8', border: '1px solid #fef08a' }}>
        <p style={{ fontWeight: 700, margin: 0, color: '#854d0e' }}>Saldo Pendiente</p>
        <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0, color: '#92400e' }}>${balance.total_pendiente.toLocaleString()}</p>
      </div>

      {/* Registrar Pago Form */}
      {balance.total_pendiente > 0 && (
        <div className="card">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '20px' }}>
            <DollarSign size={20} /> Registrar Pago
          </h3>
          
          <form onSubmit={(e) => { void handlePayment(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ maxWidth: '300px' }}>
              <Input 
                label="Número de Tirilla *" 
                placeholder="Ingrese número de tirilla" 
                required
                value={receiptNumber}
                onChange={e => { setReceiptNumber(e.target.value); }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '8px' }}>
              {debtItems.map(item => (
                <Input 
                  key={item.id}
                  label={`Monto a Pagar (${item.label})`}
                  type="number"
                  placeholder="0"
                  min={0}
                  max={item.max}
                  value={paymentAmounts[item.id] ?? ''}
                  onChange={e => { handleAmountChange(item.id, e.target.value); }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
              <Button type="submit" variant="primary" style={{ backgroundColor: '#16a34a' }} disabled={paymentLoading}>
                <Check size={16} style={{ marginRight: '8px' }} />
                Registrar Pago
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); }} title="Editar Valor de Matrícula">
        <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '8px', padding: '12px', display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <AlertTriangle size={24} color="#a16207" style={{ flexShrink: 0 }} />
          <p style={{ color: '#854d0e', margin: 0, fontSize: '0.875rem' }}>
            ¿Está seguro de que desea modificar el valor de matrícula? Esta acción quedará registrada en la auditoría.
          </p>
        </div>

        <form onSubmit={(e) => { void handleEditSubmit(e); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Concepto" 
            value={editConcept?.name ?? ''} 
            disabled 
          />
          <Input 
            label="Valor Actual" 
            value={editConcept ? `$${editConcept.currentVal.toLocaleString()}` : ''} 
            disabled 
          />
          <Input 
            label="Nuevo Valor *" 
            type="number"
            required
            value={newVal}
            onChange={e => { setNewVal(e.target.value); }}
          />
          
          <div className="input-container">
            <label className="input-label">Motivo de la Modificación *</label>
            <textarea 
              className="input-field" 
              style={{ minHeight: '80px', padding: '8px 12px' }}
              placeholder="Ingrese el motivo de la edición (obligatorio)"
              required
              value={editReason}
              onChange={e => { setEditReason(e.target.value); }}
            />
          </div>

          <div className="input-container">
            <label className="input-label">Observaciones (Opcional)</label>
            <textarea 
              className="input-field" 
              style={{ minHeight: '60px', padding: '8px 12px' }}
              placeholder="Observaciones adicionales"
              value={editObs}
              onChange={e => { setEditObs(e.target.value); }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button type="button" variant="secondary" onClick={() => { setIsEditModalOpen(false); }}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" style={{ backgroundColor: '#991b1b' }}>
              Confirmar Edición
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
