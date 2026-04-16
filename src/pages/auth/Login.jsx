import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password);
      navigate('/alumno');
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />

      <main className="main-content-centered">
        <div className="auth-card">
            <button className="btn-link" onClick={() => navigate('/')}>&lt;   Volver</button>
            <h2 className="auth-title">Acceso Alumno</h2>

            {error && <p className="auth-error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        required
                        type="text"
                        placeholder="emailejemplo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Contraseña</label>
                    <input
                        required
                        type="password"
                        placeholder="••••••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input"
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? "Cargando..." : "Entrar al Portal"}
                </button>
            </form>

            <div className="auth-footer">
                <span>¿Primera vez? Accede desde Moodle para activar tu cuenta.</span>
            </div>

        </div>
      </main>

      <Footer/>
    </div>
  );
}

export default Login;
