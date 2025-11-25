import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import {supabase} from '../../supabase/Client.js'
import './header.css'; 

function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
      await supabase.auth.signOut();
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
            onClick={() => navigate('/verificacion')}
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