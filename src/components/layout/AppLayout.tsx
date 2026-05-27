import React from 'react';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header className="layout-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            PS
          </div>
          <h1>Sistema Institucional de Paz y Salvo</h1>
        </div>
      </header>
      
      <main className="container" style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};
