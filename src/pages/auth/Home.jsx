import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./auth.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />

      <main className="home-hero">
        <h2 className="home-title">Bienvenido al Portal</h2>
        <p className="home-subtitle">
          Gestiona tus logros académicos y verifica microcredenciales mediante tecnología Blockchain de manera segura y transparente.
        </p>

        <div className="home-buttons">
            <button 
                onClick={() => navigate('/login')} 
                className="btn-hero-primary"
            >
                Iniciar Sesión
            </button>
            <button 
                onClick={() => navigate('/signup')} 
                className="btn-hero-outline"
            >
                Crear Cuenta
            </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home;