import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Home, User, FileText, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from './ui/utils';
import { careerService } from '../services/api';
import { Career } from '../types';

interface SidebarProps {
  selectedCareer?: string;
  onSelectCareer?: (career: string) => void;
  showCareerFilter?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCareer,
  onSelectCareer,
  showCareerFilter = false,
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    if (showCareerFilter) {
      careerService
        .getCareers()
        .then(setCareers)
        .catch(() => setCareers([]));
    }
  }, [showCareerFilter]);

  const menuItems = [
    {
      icon: Home,
      label: 'Inicio',
      path: '/',
      description: 'Feed de publicaciones',
    },
    {
      icon: User,
      label: 'Mi Perfil',
      path: `/profile/${user?.id}`,
      description: 'Ver mi perfil',
    },
    {
      icon: FileText,
      label: 'Publicaciones',
      path: '/?view=posts',
      description: 'Todas las publicaciones',
    },
  ];

  return (
    <aside
      className="w-64 h-screen sticky top-0 flex flex-col border-r"
      style={{
        background: 'rgba(0, 10, 30, 0.95)',
        backdropFilter: 'blur(24px)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo Section */}
      <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform"
            style={{ background: '#FFD100', boxShadow: '0 0 20px rgba(255,209,0,0.3)' }}
          >
            <GraduationCap className="h-7 w-7 text-[#003DA5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">GeTa</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Red Social UCB
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/' && location.pathname === '/');

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'shadow-lg'
                    : '',
                )}
                style={
                  isActive
                    ? {
                        background: '#FFD100',
                        boxShadow: '0 0 20px rgba(255,209,0,0.25)',
                      }
                    : {
                        color: 'rgba(255,255,255,0.65)',
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background =
                      'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = '';
                    (e.currentTarget as HTMLElement).style.color =
                      'rgba(255,255,255,0.65)';
                  }
                }}
              >
                <Icon
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: isActive ? '#003DA5' : 'inherit' }}
                />
                <div className="flex-1">
                  <p
                    className="text-sm font-medium"
                    style={{ color: isActive ? '#003DA5' : 'inherit' }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: isActive
                        ? 'rgba(0,61,165,0.7)'
                        : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Career Filter Section */}
        {showCareerFilter && onSelectCareer && (
          <div className="mt-8">
            <div
              className="flex items-center gap-2 px-4 py-3 mb-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <BookOpen className="h-4 w-4" style={{ color: 'rgba(255,209,0,0.8)' }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Filtrar por Carrera
              </h3>
            </div>

            <div className="space-y-1 max-h-80 overflow-y-auto">
              {[{ id: '', name: 'Todas las Carreras' }, ...careers].map((career) => {
                const isSelected = selectedCareer === career.name;

                return (
                  <button
                    key={career.id || 'all'}
                    onClick={() => onSelectCareer(career.name)}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                    style={
                      isSelected
                        ? {
                            background: '#FFD100',
                            color: '#003DA5',
                            fontWeight: 600,
                            boxShadow: '0 0 15px rgba(255,209,0,0.2)',
                          }
                        : {
                            color: 'rgba(255,255,255,0.6)',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.background =
                          'rgba(255,255,255,0.08)';
                        (e.currentTarget as HTMLElement).style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        (e.currentTarget as HTMLElement).style.background = '';
                        (e.currentTarget as HTMLElement).style.color =
                          'rgba(255,255,255,0.6)';
                      }
                    }}
                  >
                    <span className="line-clamp-2">{career.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* User Info Section */}
      {user && (
        <div
          className="p-4"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.3)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-[#003DA5] text-sm flex-shrink-0"
              style={{ background: '#FFD100', boxShadow: '0 0 10px rgba(255,209,0,0.3)' }}
            >
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {user.career}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
