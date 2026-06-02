import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import { logout, isAuthenticated } from '../../services/authService';
import { getNotificationSummary } from '../../services/notificationService';
import { getMessageSummary } from '../../services/messageService';
import type { DashboardView } from '../../types/dashboard.types';
import {
  BellIcon,
  HomeIcon,
  MessageIcon,
  SearchIcon,
  UserIcon,
  LogoutIcon,
  CompassIcon,
} from '../icons/AppIcons';
import '../../styles/home/HomeTopbar.css';

type HomeTopbarProps = {
  activeView?: DashboardView;
};

function buildHomeSearch(view: DashboardView, extra?: Record<string, string>) {
  const params = new URLSearchParams({ view });

  Object.entries(extra || {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  return `?${params.toString()}`;
}

function HomeTopbar({ activeView = 'feed' }: HomeTopbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchValue, setSearchValue] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get('q') || '');
  }, [location.search]);

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    const loadSummary = async () => {
      try {
        const [notifications, messages] = await Promise.all([
          getNotificationSummary(),
          getMessageSummary(),
        ]);

        setNotificationCount(notifications.unreadCount || 0);
        setMessageCount(messages.unreadCount || 0);
      } catch {
        setNotificationCount(0);
        setMessageCount(0);
      }
    };

    loadSummary();
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const goToView = (view: DashboardView, extra?: Record<string, string>) => {
    navigate(`/home${buildHomeSearch(view, extra)}`);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goToView('search', { q: searchValue.trim() });
  };

  return (
    <header className="home-topbar">
      <div className="topbar-left">
        <button
          className="topbar-logo-button"
          onClick={() => goToView('feed')}
          type="button"
          aria-label="Ir al inicio"
        >
          <img src={logo} alt="GeTa logo" className="topbar-logo" />
        </button>

        <form className="topbar-search" onSubmit={handleSearchSubmit}>
          <span className="topbar-search-icon">
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Buscar en GeTa"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </form>
      </div>

      <nav className="topbar-center">
        <button
          className={activeView === 'feed' ? 'topbar-nav-button active' : 'topbar-nav-button'}
          onClick={() => goToView('feed')}
          type="button"
        >
          <HomeIcon size={16} />
          <span>Inicio</span>
        </button>
        <button
          className={activeView === 'career' ? 'topbar-nav-button active' : 'topbar-nav-button'}
          onClick={() => goToView('career')}
          type="button"
        >
          <UserIcon size={16} />
          <span>Mi carrera</span>
        </button>
        <button
          className={activeView === 'explore' ? 'topbar-nav-button active' : 'topbar-nav-button'}
          onClick={() => goToView('explore')}
          type="button"
        >
          <CompassIcon size={16} />
          <span>Explorar</span>
        </button>
      </nav>

      <div className="topbar-right">
        <button
          type="button"
          className="topbar-icon-button"
          onClick={() => goToView('messages')}
          aria-label="Mensajes"
        >
          <MessageIcon size={18} />
          {messageCount > 0 && <span className="topbar-badge">{messageCount}</span>}
        </button>

        <button
          type="button"
          className="topbar-icon-button"
          onClick={() => goToView('notifications')}
          aria-label="Notificaciones"
        >
          <BellIcon size={18} />
          {notificationCount > 0 && (
            <span className="topbar-badge">{notificationCount}</span>
          )}
        </button>

        <button
          type="button"
          className="topbar-action-button"
          onClick={() => navigate('/profile')}
        >
          <UserIcon size={16} />
          <span>{activeView === 'profile' ? 'Mi perfil' : 'Perfil'}</span>
        </button>

        <button className="topbar-logout-button" onClick={handleLogout} type="button">
          <LogoutIcon size={16} />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}

export default HomeTopbar;
