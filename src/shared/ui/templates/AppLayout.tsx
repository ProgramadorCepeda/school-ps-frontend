import React from 'react';

interface AppLayoutProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, header, children }) => {
  return (
    <div className="app-layout-container">
      {/* Sidebar on the Left */}
      <aside className="app-sidebar">{sidebar}</aside>

      {/* Main viewport area */}
      <div className="app-main-content">
        {/* Top bar header */}
        <header className="app-top-header">{header}</header>

        {/* Dynamic page container */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
};
