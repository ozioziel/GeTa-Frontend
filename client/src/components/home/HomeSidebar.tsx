import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DashboardView } from '../../types/dashboard.types';
import {
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CompassIcon,
  HomeIcon,
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

const MOBILE_BREAKPOINT = 860;

const sidebarItems: SidebarItem[] = [
  { label: 'Inicio', icon: <HomeIcon size={24} />, view: 'feed' },
  { label: 'Buscar', icon: <SearchIcon size={24} />, view: 'search' },
  { label: 'Explorar', icon: <CompassIcon size={24} />, view: 'explore' },
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

function isMobileViewport() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function HomeSidebar({ activeView = 'feed' }: HomeSidebarProps) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(isMobileViewport);
  const [isExpanded, setIsExpanded] = useState(() => !isMobileViewport());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    let previousIsMobile = isMobileViewport();

    const handleResize = () => {
      const nextIsMobile = isMobileViewport();

      setIsMobile(nextIsMobile);

      if (nextIsMobile !== previousIsMobile) {
        previousIsMobile = nextIsMobile;
        setIsExpanded(!nextIsMobile);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !isMobile || !isExpanded) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isExpanded, isMobile]);

  const handleNavigate = (item: SidebarItem) => {
    const target = item.view === 'profile'
      ? '/profile'
      : `/home${buildHomeSearch(item.view, item.extra)}`;

    navigate(target);

    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded((currentValue) => !currentValue);
  };

  const shellClassName = [
    'home-sidebar-shell',
    isMobile ? 'is-mobile' : 'is-desktop',
    isExpanded ? 'is-expanded' : 'is-collapsed',
  ].join(' ');

  return (
    <div className={shellClassName}>
      {isMobile && isExpanded && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={() => setIsExpanded(false)}
          aria-label="Cerrar menu lateral"
        />
      )}

      <aside className="home-sidebar">
        <nav className="sidebar-icon-menu" aria-label="Menu principal">
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
                title={isExpanded ? undefined : item.label}
                aria-label={item.label}
                onClick={() => handleNavigate(item)}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className={isExpanded ? 'sidebar-item-label' : 'sidebar-item-label is-hidden'}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          className="sidebar-edge-toggle"
          onClick={toggleSidebar}
          aria-label={isExpanded ? 'Colapsar menu' : 'Expandir menu'}
          title={isExpanded ? 'Colapsar menu' : 'Expandir menu'}
        >
          {isExpanded ? (
            <ChevronLeftIcon size={20} />
          ) : (
            <ChevronRightIcon size={20} />
          )}
        </button>
      </aside>
    </div>
  );
}

export default HomeSidebar;
