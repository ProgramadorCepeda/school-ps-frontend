import { useState, type MouseEvent } from 'react';
import { useNavigate, useRouterState, Link } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Shield,
  CreditCard,
  Calendar,
  GraduationCap,
  Sofa,
  FileText,
  Dumbbell,
  Trophy,
  Coffee,
  School,
  Music,
  Building,
  LogOut,
  User,
  X,
} from 'lucide-react';
import type { LoginUser } from '@/features/auth/api/authApi';
import { AppLayout } from '@/shared/ui/templates/AppLayout';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const [currentUser] = useState<LoginUser | null>(() => {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as LoginUser;
      } catch (err) {
        console.error('Error parsing user session:', err);
      }
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    void navigate({ to: '/login' });
  };

  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/central', label: 'Paz y Salvo Central', icon: Shield },
    { path: '/dashboard/enrollment', label: 'Matrícula', icon: CreditCard },
    { path: '/pension', label: 'Pensión', icon: Calendar },
    { path: '/escuelas', label: 'Escuelas de Formación', icon: GraduationCap },
    { path: '/tesoreria', label: 'Salón Tesorería', icon: Sofa },
    { path: '/pruebas', label: 'Pruebas Internas', icon: FileText },
    { path: '/deportes', label: 'Deportes', icon: Dumbbell },
    { path: '/ajedrez', label: 'Ajedrez', icon: Trophy },
    { path: '/cafeteria', label: 'Cafetería', icon: Coffee },
    { path: '/titular', label: 'Salón Titular', icon: School },
    { path: '/banda', label: 'Banda', icon: Music },
    { path: '/rectoria', label: 'Rectoría', icon: Building },
  ];

  const isItemActive = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return currentPath === '/dashboard';
    }
    if (itemPath === '/dashboard/enrollment') {
      return currentPath.startsWith('/dashboard/enrollment') || currentPath.includes('/student/');
    }
    return false;
  };

  const handleItemClick = (e: MouseEvent, itemPath: string, label: string) => {
    if (itemPath === '/dashboard' || itemPath === '/dashboard/enrollment') {
      return;
    }
    e.preventDefault();
    alert(`El módulo "${label}" se encuentra en desarrollo por otro equipo.`);
  };

  const sidebar = (
    <>
      <div className="app-sidebar-header">
        <h1>SchoolPS</h1>
        <p>Sistema de Paz y Salvo</p>
      </div>

      <nav className="app-sidebar-menu">
        {sidebarItems.map((item) => {
          const IconComp = item.icon;
          const active = isItemActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => {
                handleItemClick(e, item.path, item.label);
              }}
              className={`app-sidebar-item ${active ? 'active' : ''}`}
            >
              <IconComp size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  const header = (
    <>
      {/* Welcome brand section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{ color: '#801c1c', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => {
            void navigate({ to: '/dashboard' });
          }}
        >
          <X size={20} />
        </div>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          Bienvenido al Sistema de Paz y Salvo - Cambridge School
        </span>
      </div>

      {/* User profile info / Logout */}
      {currentUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
              }}
            >
              <User size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  lineHeight: '1.2',
                }}
              >
                {currentUser.username}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentUser.rol}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--status-red)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: '6px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--status-red-bg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      )}
    </>
  );

  return (
    <AppLayout sidebar={sidebar} header={header}>
      {children}
    </AppLayout>
  );
};
