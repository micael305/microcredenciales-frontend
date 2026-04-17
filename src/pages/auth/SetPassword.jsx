import { useState, useEffect } from "react";
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

  const isOnboarding = !user?.has_password;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/alumno', { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

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
          {!isOnboarding && (
            <button className="btn-link" onClick={() => navigate('/alumno')}>&lt;   Volver al Dashboard</button>
          )}

          <h2 className="auth-title">
            {isOnboarding ? 'Configurar Contraseña' : 'Actualizar Contraseña'}
          </h2>

          {isOnboarding && !success && (
            <div className="auth-info" style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#003366' }}>
                Bienvenido al Portal de Credenciales
              </p>
              <p>
                Para poder acceder al portal directamente en el futuro,
                configura una contraseña para tu cuenta.
              </p>
            </div>
          )}

          {!isOnboarding && !success && (
            <p className="auth-info">Ya tienes una contraseña configurada. Puedes actualizarla aquí.</p>
          )}

          {success ? (
            <div className="auth-success">
              <p>Contraseña configurada correctamente.</p>
              <p>Ahora puedes iniciar sesión directamente con tu email y contraseña.</p>
              <button className="btn-primary" onClick={() => navigate('/alumno', { replace: true })}>
                Ir al Dashboard
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
                  {loading ? "Guardando..." : (isOnboarding ? "Configurar Contraseña" : "Actualizar Contraseña")}
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
