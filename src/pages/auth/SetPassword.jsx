import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../api/client";
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./auth.css";

function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await api.setPassword(password);
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Error al configurar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />

      <main className="main-content-centered">
        <div className="auth-card">
          <button className="btn-link" onClick={() => navigate('/alumno')}>&lt;   Volver al Dashboard</button>
          <h2 className="auth-title">Configurar Contraseña</h2>

          {user?.has_password && !success && (
            <p className="auth-info">Ya tienes una contraseña configurada. Puedes actualizarla aquí.</p>
          )}

          {success ? (
            <div className="auth-success">
              <p>Contraseña configurada correctamente.</p>
              <p>Ahora puedes iniciar sesión directamente con tu email y contraseña.</p>
              <button className="btn-primary" onClick={() => navigate('/alumno')}>
                Volver al Dashboard
              </button>
            </div>
          ) : (
            <>
              {error && <p className="auth-error">{error}</p>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nueva Contraseña</label>
                  <input
                    required
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    minLength={8}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirmar Contraseña</label>
                  <input
                    required
                    type="password"
                    placeholder="Repetir contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                    minLength={8}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Guardando..." : "Configurar Contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default SetPassword;
