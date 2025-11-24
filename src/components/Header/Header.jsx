import { useNavigate } from 'react-router-dom';
import './header.css'; 

function Header() {
  const navigate = useNavigate();

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
            onClick={() => navigate('/verificacion')}
            className="nav-link"
          >
            Verificación Pública
          </button>

          {/* <button
            onClick={() => navigate('/login')}
            className="btn-login-header"
          >
            Iniciar Sesión
          </button> */}
        </nav>
      </div>
    </header>
  );
}

export default Header;