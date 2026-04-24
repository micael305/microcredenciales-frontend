import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';
  const isOnAdminPage = location.pathname === '/admin';

  return (
    <header className="header">
      <div className="header-container">

        <div
          onClick={() => navigate('/')}
          className="header-logo"
        >
          UTN-FRT MicroCredenciales
        </div>

        <nav className="header-nav">
          {user && isAdmin && !isOnAdminPage && (
            <button
              onClick={() => navigate('/admin')}
              className="nav-link"
            >
              Panel Admin
            </button>
          )}

          {user && isAdmin && isOnAdminPage && (
            <button
              onClick={() => navigate('/alumno')}
              className="nav-link"
            >
              Mis Credenciales
            </button>
          )}

          <button
            onClick={() => navigate('/verificar')}
            className="nav-link"
          >
            Verificación Pública
          </button>

          {user && (
            <button
              onClick={handleLogout}
              className="btn-logout-header"
            >
              Cerrar Sesión
            </button>
          )}

        </nav>
      </div>
    </header>
  );
}

export default Header;
