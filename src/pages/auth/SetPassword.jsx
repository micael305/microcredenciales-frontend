import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../api/client";
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./auth.css";

const RequirementIcon = ({ fulfilled }) => (
  <svg 
    width="16" height="16" viewBox="0 0 24 24" 
    fill={fulfilled ? "#14b8a6" : "none"} 
    stroke={fulfilled ? "#14b8a6" : "#9ca3af"} 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="req-icon"
  >
    {fulfilled ? (
      <>
        <circle cx="12" cy="12" r="10" />
        <path stroke="#ffffff" d="M9 12l2 2 4-4" />
      </>
    ) : (
      <circle cx="12" cy="12" r="10" />
    )}
  </svg>
);

function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const isOnboarding = !user?.has_password;

  // Real-time dynamic validations
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  // Form validity
  const isFormValid = hasMinLength && hasUppercase && hasNumber && passwordsMatch;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/alumno', { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid) {
      setError("Por favor, asegúrate de cumplir con todos los requisitos de la contraseña.");
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
          {!isOnboarding && !success && (
            <button className="btn-link back-link" onClick={() => navigate('/alumno')}>&lt; Volver al Dashboard</button>
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
                configura una contraseña de acceso.
              </p>
            </div>
          )}

          {!isOnboarding && !success && (
            <p className="auth-info">Ingresa tu nueva contraseña corporativa.</p>
          )}

          {success ? (
            <div className="auth-success">
              <p>Contraseña configurada correctamente.</p>
              <p>Ahora puedes iniciar sesión directamente con tu email y nueva contraseña.</p>
              <button className="btn-primary" onClick={() => navigate('/alumno', { replace: true })}>
                Ir al Dashboard
              </button>
            </div>
          ) : (
            <>
              {error && <p className="auth-error">{error}</p>}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Nueva Contraseña</label>
                  <input
                    required
                    type="password"
                    placeholder="Introduce tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="password-requirements">
                  <div className={`req-item ${hasMinLength ? 'fulfilled' : ''}`}>
                    <RequirementIcon fulfilled={hasMinLength} />
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div className={`req-item ${hasUppercase ? 'fulfilled' : ''}`}>
                    <RequirementIcon fulfilled={hasUppercase} />
                    <span>Al menos 1 mayúscula</span>
                  </div>
                  <div className={`req-item ${hasNumber ? 'fulfilled' : ''}`}>
                    <RequirementIcon fulfilled={hasNumber} />
                    <span>Al menos 1 número</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label className="form-label">Confirmar Contraseña</label>
                  <input
                    required
                    type="password"
                    placeholder="Repite la contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                  {confirmPassword.length > 0 && (
                    <div className={`req-item match-indicator ${passwordsMatch ? 'fulfilled' : 'error'}`}>
                      <RequirementIcon fulfilled={passwordsMatch} />
                      <span>{passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}</span>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading || !isFormValid} className={`btn-primary ${!isFormValid ? 'btn-disabled' : ''}`}>
                  {loading ? "Guardando..." : (isOnboarding ? "Guardar Contraseña" : "Actualizar Contraseña")}
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
