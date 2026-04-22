import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff, MdArrowBack } from 'react-icons/md';
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
            <button className="btn-link" onClick={() => navigate('/')}>
              <MdArrowBack /> Volver
            </button>
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
                    <div className="auth-input-wrapper">
                        <input
                            required
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-input form-input--with-icon"
                        />
                        <button
                            type="button"
                            className="auth-visibility-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                        </button>
                    </div>
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
