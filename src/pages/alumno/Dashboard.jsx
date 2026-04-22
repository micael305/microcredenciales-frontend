import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/client';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CredentialCard from '../../components/CredentialCard/CredentialCard';
import ShareModal from '../../components/ShareModal/ShareModal';
import './alumno.css';

const STATUS_LABELS = {
  issued: 'Emitida',
  claimed: 'Guardada',
  pending: 'Pendiente',
};

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [credentialToShare, setCredentialToShare] = useState(null);

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
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const emitted = stats ? stats.issued + stats.claimed : 0;
  const pending = stats ? stats.pending : 0;

  return (
    <div className="dash-page">
      <Header />

      <main className="dash-main">
        {/* ── Hero Section ── */}
        <section className="dash-hero">
          <h1 className="dash-hero__title">
            Bienvenido, {user?.full_name?.split(' ')[0] || 'Alumno'}
          </h1>
          <p className="dash-hero__subtitle">
            Gestiona y comparte tus logros académicos
          </p>
        </section>

        {loading ? (
          <div className="dash-loading">
            <p>Cargando credenciales…</p>
          </div>
        ) : error ? (
          <div className="dash-error">
            <p>{error}</p>
          </div>
        ) : (
          /* ── Bento Grid Layout ── */
          <div className="dash-bento">
            {/* ── Left: Stats ── */}
            <div className="dash-bento__stats">
              <div className="dash-stat-card">
                <span className="dash-stat-card__icon">🏆</span>
                <h2 className="dash-stat-card__number">{emitted}</h2>
                <p className="dash-stat-card__label">Credenciales Emitidas</p>
              </div>
              {pending > 0 && (
                <div className="dash-stat-card dash-stat-card--warning">
                  <span className="dash-stat-card__icon">⏳</span>
                  <h2 className="dash-stat-card__number">{pending}</h2>
                  <p className="dash-stat-card__label">Pendientes</p>
                </div>
              )}
            </div>

            {/* ── Right: Credentials ── */}
            <div className="dash-bento__credentials">
              <div className="dash-section-header">
                <h2 className="dash-section-header__title">Mis Microcredenciales</h2>
              </div>

              {credentials.length === 0 ? (
                <div className="dash-empty-grid">
                  <div className="dash-empty-card">
                    <span className="dash-empty-card__icon">+</span>
                    <p className="dash-empty-card__text">
                      Próximos logros aparecerán aquí
                    </p>
                  </div>
                </div>
              ) : (
                <div className="dash-credentials-grid">
                  {credentials.map((cred) => (
                    <CredentialCard
                      key={cred.id}
                      title={cred.course_name}
                      issuer="UTN-FRT"
                      issueDate={formatDate(cred.completion_date)}
                      status={STATUS_LABELS[cred.status] || cred.status}
                      isPublic={cred.is_public}
                      isAnchored={cred.status === 'claimed' || cred.status === 'issued'}
                      onViewDetails={() => navigate(`/alumno/credencial/${cred.id}`)}
                      onShare={() => setCredentialToShare(cred)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />

      <ShareModal
        credential={credentialToShare}
        onClose={() => setCredentialToShare(null)}
      />
    </div>
  );
}

export default Dashboard;
