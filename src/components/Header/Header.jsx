import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './header.css';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
