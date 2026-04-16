import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../api/client";
// Componentes
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import StartCard from "../../components/StartCard/StartCard";
import CredentialCard from "../../components/CredentialCard/CredentialCard";
// Modales
import CredentialModal from "../../components/CredentialModal/CredentialModal";
import ShareModal from "../../components/ShareModal/ShareModal";
// Estilos
import "./alumno.css";

const STATUS_LABELS = {
  issued: "Emitida",
  claimed: "Guardada",
  pending: "Pendiente",
};

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function Dashboard() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [credentialToShare, setCredentialToShare] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, credsData] = await Promise.all([
          api.getStats(),
          api.getCredentials(),
        ]);
        setStats(statsData);
        setCredentials(credsData);
      } catch (err) {
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleViewDetails = async (cred) => {
    setLoadingDetail(true);
    try {
      const detail = await api.getCredentialDetail(cred.id);
      setSelectedCredential(detail);
    } catch {
      setSelectedCredential(cred);
    } finally {
      setLoadingDetail(false);
    }
  };

  const emitted = stats ? stats.issued + stats.claimed : 0;
  const pending = stats ? stats.pending : 0;

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-header">
        <h1>Bienvenido, {user?.full_name || "Alumno"}</h1>
        <h3>Gestiona y comparte tus logros académicos de forma segura.</h3>
        <hr className="header-divider" />
      </div>

      {loading ? (
        <div className="dashboard-loading">
          <p>Cargando credenciales...</p>
        </div>
      ) : error ? (
        <div className="dashboard-error">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="starcard-container">
            <StartCard number={emitted} label="Credenciales Emitidas" />
            <StartCard number={pending} label="Pendientes de Aceptación" color="orange" />
          </div>

          <h4 className="credentialcard-title">Mis Microcredenciales</h4>

          {credentials.length === 0 ? (
            <div className="dashboard-empty">
              <p>Aún no tienes credenciales emitidas. Completa cursos en Moodle para obtenerlas.</p>
            </div>
          ) : (
            <div className="credentialcard-container">
              {credentials.map((cred) => (
                <CredentialCard
                  key={cred.id}
                  title={cred.course_name}
                  issuer="UTN-FRT"
                  issueDate={formatDate(cred.completion_date)}
                  status={STATUS_LABELS[cred.status] || cred.status}
                  onViewDetails={() => handleViewDetails(cred)}
                  onShare={() => setCredentialToShare(cred)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <Footer />

      {loadingDetail && (
        <div className="modal-overlay">
          <p style={{ color: '#fff', fontSize: '1.1rem' }}>Cargando detalle...</p>
        </div>
      )}

      <CredentialModal
        credential={selectedCredential}
        onClose={() => setSelectedCredential(null)}
      />
      <ShareModal
        credential={credentialToShare}
        onClose={() => setCredentialToShare(null)}
      />
    </div>
  );
}

export default Dashboard;
