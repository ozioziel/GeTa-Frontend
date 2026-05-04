import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import { logout } from '../../services/authService';
import '../../styles/home/HomeTopbar.css';

function HomeTopbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="home-topbar">
      <div className="topbar-left">
        <button className="topbar-logo-button" onClick={() => navigate('/home')}>
          <img src={logo} alt="GeTa logo" className="topbar-logo" />
        </button>

        <div className="topbar-search">
          <span>⌕</span>
          <input type="text" placeholder="Buscar en GeTa" />
        </div>
      </div>

      <nav className="topbar-center">
        <button className="topbar-nav-button active">Inicio</button>
        <button className="topbar-nav-button">Mi Carrera</button>
        <button className="topbar-nav-button">Explorar</button>
      </nav>

      <div className="topbar-right">
        <button
                type="button"
                className="topbar-action-button"
                onClick={() => navigate('/profile')}
                >
                Perfil
                </button>
        <button className="topbar-icon-button">🔔</button>
        <button className="topbar-logout-button" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
}

export default HomeTopbar;