import React from 'react';

export type StatusType = 'sin_abono' | 'parcial' | 'paz_y_salvo' | 'sin_matricula' | 'pendiente' | 'observacion';

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  let badgeClass = 'badge-neutral';
  let defaultLabel = status;

  if (status === 'paz_y_salvo' || status === 'solvente') {
    badgeClass = 'badge-green';
    defaultLabel = 'Paz y Salvo';
  } else if (status === 'parcial' || status === 'observacion') {
    badgeClass = 'badge-yellow';
    defaultLabel = status === 'parcial' ? 'Parcial' : 'Observación';
  } else if (status === 'sin_abono' || status === 'deudor' || status === 'pendiente') {
    badgeClass = 'badge-yellow'; // En los mockups, "Pendiente" es amarillo
    defaultLabel = 'Pendiente';
  } else if (status === 'sin_matricula') {
    badgeClass = 'badge-neutral';
    defaultLabel = 'Sin Matrícula';
  } else if (status === 'no_paz_y_salvo') {
    badgeClass = 'badge-red';
    defaultLabel = 'No Paz y Salvo';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {label ?? defaultLabel}
    </span>
  );
};
