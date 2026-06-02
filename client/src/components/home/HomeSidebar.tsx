import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import type { DashboardView } from '../../types/dashboard.types';
import {
  BookmarkIcon,
  CompassIcon,
  HomeIcon,
  PlusSquareIcon,
  SearchIcon,
  UserIcon,
} from '../icons/AppIcons';
import '../../styles/home/HomeSidebar.css';

type SidebarItem = {
  label: string;
  view: DashboardView;
  extra?: Record<string, string>;
  icon: ReactNode;
};

type HomeSidebarProps = {
  activeView?: DashboardView;
};

const sidebarItems: SidebarItem[] = [
  { label: 'Inicio', icon: <HomeIcon size={24} />, view: 'feed' },
  { label: 'Buscar', icon: <SearchIcon size={24} />, view: 'search' },
  { label: 'Explorar', icon: <CompassIcon size={24} />, view: 'explore' },
  {
    label: 'Crear',
    icon: <PlusSquareIcon size={24} />,
    view: 'feed',
    extra: { composer: '1' },
  },
  { label: 'Guardados', icon: <BookmarkIcon size={24} />, view: 'saved' },
  { label: 'Perfil', icon: <UserIcon size={24} />, view: 'profile' },
];

function buildHomeSearch(view: DashboardView, extra?: Record<string, string>) {
  const params = new URLSearchParams({ view });

  Object.entries(extra || {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return `?${params.toString()}`;
}

function HomeSidebar({ activeView = 'feed' }: HomeSidebarProps) {
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return (
      <button
        type="button"
        className="sidebar-open-button"
        onClick={() => setIsHidden(false)}
        title="Mostrar menu"
      >
        +
      </button>
    );
  }

  return (
    <aside className="home-sidebar">
      <button
        type="button"
        className="sidebar-logo-wrapper"
        onClick={() => navigate('/home?view=feed')}
        aria-label="Ir al inicio"
      >
        <img src={logo} alt="GeTa" className="sidebar-logo" />
      </button>

      <nav className="sidebar-icon-menu">
        {sidebarItems.map((item) => {
          const isProfile = item.view === 'profile';
          const isActive = isProfile
            ? activeView === 'profile'
            : activeView === item.view;

          return (
            <button
              key={item.label}
              type="button"
              className={isActive ? 'sidebar-icon-item active' : 'sidebar-icon-item'}
              title={item.label}
              onClick={() =>
                navigate(
                  isProfile
                    ? '/profile'
                    : `/home${buildHomeSearch(item.view, item.extra)}`,
                )
              }
            >
              <span>{item.icon}</span>
              <small>{item.label}</small>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="sidebar-hide-button"
        onClick={() => setIsHidden(true)}
        title="Ocultar menu"
      >
        x
      </button>
    </aside>
  );
}

export default HomeSidebar;
