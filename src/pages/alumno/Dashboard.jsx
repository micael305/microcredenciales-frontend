import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdGridView,
  MdViewList,
  MdFilterList,
  MdPublic,
  MdLock,
  MdShare,
  MdSchool,
  MdAccountBalance,
  MdCalendarToday,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/client';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ShareModal from '../../components/ShareModal/ShareModal';
import './alumno.css';

const STATUS_LABELS = {
  issued: 'Emitida',
  claimed: 'Guardada',
  pending: 'Pendiente',
};

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'issued', label: 'Emitidas' },
  { value: 'claimed', label: 'Guardadas' },
  { value: 'pending', label: 'Pendientes' },
];

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

  // UI state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filter, setFilter] = useState('all');

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

  const handleToggleVisibility = useCallback(async (cred) => {
    const newValue = !cred.is_public;
    try {
      await api.toggleVisibility(cred.credential_hash, newValue);
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === cred.id ? { ...c, is_public: newValue } : c
        )
      );
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  }, []);

  const filtered = filter === 'all'
    ? credentials
    : credentials.filter((c) => c.status === filter);

  const emitted = stats ? stats.issued + stats.claimed : 0;
  const pending = stats ? stats.pending : 0;

  return (
    <div className="dash-page">
      <Header />

      <main className="dash-main">
        {/* ── Hero ── */}
        <section className="dash-hero">
          <div className="dash-hero__text">
            <h1 className="dash-hero__title">
              Bienvenido, {user?.full_name?.split(' ')[0] || 'Alumno'}
            </h1>
            <p className="dash-hero__subtitle">
              Gestiona y comparte tus logros académicos
            </p>
          </div>
          {/* Compact Stats Chips */}
          {stats && (
            <div className="dash-stats-row">
              <div className="dash-stat-chip">
                <span className="dash-stat-chip__number">{emitted}</span>
                <span className="dash-stat-chip__label">Emitidas</span>
              </div>
              {pending > 0 && (
                <div className="dash-stat-chip dash-stat-chip--warning">
                  <span className="dash-stat-chip__number">{pending}</span>
                  <span className="dash-stat-chip__label">Pendientes</span>
                </div>
              )}
            </div>
          )}
        </section>

        {loading ? (
          <div className="dash-loading"><p>Cargando credenciales…</p></div>
        ) : error ? (
          <div className="dash-error"><p>{error}</p></div>
        ) : (
          <>
            {/* ── Toolbar: Title + Filter + View Toggle ── */}
            <div className="dash-toolbar">
              <h2 className="dash-toolbar__title">Mis Microcredenciales</h2>
              <div className="dash-toolbar__controls">
                {/* Filter */}
                <div className="dash-filter">
                  <MdFilterList className="dash-filter__icon" />
                  <select
                    className="dash-filter__select"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    id="credential-filter"
                  >
                    {FILTER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* View Toggle */}
                <div className="dash-view-toggle">
                  <button
                    className={`dash-view-toggle__btn ${viewMode === 'grid' ? 'dash-view-toggle__btn--active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Vista cuadrícula"
                    title="Cuadrícula"
                  >
                    <MdGridView />
                  </button>
                  <button
                    className={`dash-view-toggle__btn ${viewMode === 'list' ? 'dash-view-toggle__btn--active' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="Vista lista"
                    title="Lista"
                  >
                    <MdViewList />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Credentials ── */}
            {filtered.length === 0 ? (
              <div className="dash-empty">
                <p className="dash-empty__text">
                  {filter === 'all'
                    ? 'Aún no tienes credenciales. Completa cursos en Moodle para obtenerlas.'
                    : 'No hay credenciales con el filtro seleccionado.'}
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="dash-grid">
                {filtered.map((cred) => (
                  <article className="cred-card" key={cred.id} id={`cred-${cred.id}`}>
                    <div className="cred-card__header">
                      <div className="cred-card__icon">
                        <MdSchool />
                      </div>
                      <span className={`cred-badge cred-badge--${cred.status}`}>
                        {STATUS_LABELS[cred.status] || cred.status}
                      </span>
                    </div>
                    <div className="cred-card__body">
                      <h3 className="cred-card__title">{cred.course_name}</h3>
                      <p className="cred-card__meta">
                        <MdAccountBalance className="cred-card__meta-icon" />
                        UTN-FRT
                      </p>
                      <p className="cred-card__meta cred-card__meta--secondary">
                        <MdCalendarToday className="cred-card__meta-icon" />
                        {formatDate(cred.completion_date)}
                      </p>
                    </div>
                    {/* Visibility Row */}
                    <div className="cred-card__visibility">
                      <div className="cred-card__visibility-info">
                        {cred.is_public ? <MdPublic /> : <MdLock />}
                        <span>{cred.is_public ? 'Pública' : 'Privada'}</span>
                      </div>
                      <button
                        role="switch"
                        aria-checked={cred.is_public}
                        className={`cred-switch ${cred.is_public ? 'cred-switch--on' : ''}`}
                        onClick={() => handleToggleVisibility(cred)}
                        title={cred.is_public ? 'Hacer privada' : 'Hacer pública'}
                      >
                        <span className="cred-switch__track">
                          <span className="cred-switch__thumb" />
                        </span>
                      </button>
                    </div>
                    <div className="cred-card__footer">
                      <button
                        className="cred-card__btn-primary"
                        onClick={() => navigate(`/alumno/credencial/${cred.id}`)}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className="cred-card__btn-icon"
                        onClick={() => setCredentialToShare(cred)}
                        aria-label="Compartir"
                        title="Compartir"
                      >
                        <MdShare />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* ── List View ── */
              <div className="dash-list">
                {filtered.map((cred) => (
                  <div className="cred-list-item" key={cred.id} id={`cred-list-${cred.id}`}>
                    <div className="cred-list-item__icon">
                      <MdSchool />
                    </div>
                    <div className="cred-list-item__content">
                      <h3 className="cred-list-item__title">{cred.course_name}</h3>
                      <p className="cred-list-item__meta">
                        UTN-FRT · {formatDate(cred.completion_date)}
                      </p>
                    </div>
                    <span className={`cred-badge cred-badge--${cred.status}`}>
                      {STATUS_LABELS[cred.status] || cred.status}
                    </span>
                    <div className="cred-list-item__visibility">
                      {cred.is_public ? <MdPublic className="cred-list-item__vis-icon cred-list-item__vis-icon--public" /> : <MdLock className="cred-list-item__vis-icon" />}
                      <button
                        role="switch"
                        aria-checked={cred.is_public}
                        className={`cred-switch cred-switch--sm ${cred.is_public ? 'cred-switch--on' : ''}`}
                        onClick={() => handleToggleVisibility(cred)}
                        title={cred.is_public ? 'Hacer privada' : 'Hacer pública'}
                      >
                        <span className="cred-switch__track">
                          <span className="cred-switch__thumb" />
                        </span>
                      </button>
                    </div>
                    <div className="cred-list-item__actions">
                      <button
                        className="cred-list-item__btn"
                        onClick={() => navigate(`/alumno/credencial/${cred.id}`)}
                      >
                        Detalles
                      </button>
                      <button
                        className="cred-card__btn-icon"
                        onClick={() => setCredentialToShare(cred)}
                        aria-label="Compartir"
                      >
                        <MdShare />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
