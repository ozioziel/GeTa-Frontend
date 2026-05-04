import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import '../../styles/home/HomeSidebar.css';

type SidebarItem = {
  label: string;
  icon: string;
  path: string;
};

const sidebarItems: SidebarItem[] = [
  { label: 'Inicio', icon: '⌂', path: '/home' },
  { label: 'Buscar', icon: '⌕', path: '/home' },
  { label: 'Explorar', icon: '◇', path: '/home' },
  { label: 'Crear', icon: '✚', path: '/home' },
  { label: 'Guardados', icon: '♡', path: '/home' },
  { label: 'Perfil', icon: '◉', path: '/profile' },
];

function HomeSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return (
      <button
        type="button"
        className="sidebar-open-button"
        onClick={() => setIsHidden(false)}
        title="Mostrar menú"
      >
        ☰
      </button>
    );
  }

  return (
    <aside className="home-sidebar">
      <div className="sidebar-logo-wrapper" onClick={() => navigate('/home')}>
        <img src={logo} alt="GeTa" className="sidebar-logo" />
      </div>

      <nav className="sidebar-icon-menu">
        {sidebarItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`sidebar-icon-item ${
              location.pathname === item.path ? 'active' : ''
            }`}
            title={item.label}
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span>
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="sidebar-hide-button"
        onClick={() => setIsHidden(true)}
        title="Ocultar menú"
      >
        ×
      </button>
    </aside>
  );
}

export default HomeSidebar;