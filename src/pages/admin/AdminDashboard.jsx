import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MdSearch,
  MdFilterList,
  MdWarning,
  MdSchool,
  MdVerified,
  MdBlock,
  MdHourglassTop,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/client';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './admin.css';

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'anchored', label: 'Ancladas' },
  { value: 'revoked', label: 'Revocadas' },
  { value: 'not_anchored', label: 'Sin anclar' },
];

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  const config = {
    anchored: {
      label: 'Anclada',
      className: 'admin-badge--anchored',
      icon: <MdVerified size={14} />,
    },
    revoked: {
      label: 'Revocada',
      className: 'admin-badge--revoked',
      icon: <MdBlock size={14} />,
    },
    not_anchored: {
      label: 'Sin anclar',
      className: 'admin-badge--not-anchored',
      icon: <MdHourglassTop size={14} />,
    },
  };

  const { label, className, icon } = config[status] || config.not_anchored;

  return (
    <span className={`admin-badge ${className}`}>
      {icon} {label}
    </span>
  );
}

function RevokeDialog({ credential, onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState('');

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="admin-revoke-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Revocar Credencial</h2>

        <div className="admin-revoke-dialog-info">
          <p>
            Estudiante: <strong>{credential.student_name}</strong>
          </p>
          <p>
            Curso: <strong>{credential.course_name}</strong>
          </p>
          <p>
            Fecha: <strong>{formatDate(credential.completion_date)}</strong>
          </p>
        </div>

        <div className="admin-revoke-dialog-warning">
          <MdWarning className="admin-revoke-dialog-warning-icon" />
          <span>
            Esta acción es <strong>irreversible</strong>. La credencial será
            marcada como revocada en la blockchain y no podrá ser revalidada.
            El estudiante verá el estado actualizado en su portal.
          </span>
        </div>

        <textarea
          className="admin-revoke-reason-input"
          placeholder="Motivo de la revocación (obligatorio)..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={256}
        />

        <div className="admin-revoke-dialog-actions">
          <button
            className="admin-btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="admin-btn-confirm-revoke"
            onClick={() => onConfirm(reason)}
            disabled={loading || reason.trim().length < 3}
          >
            {loading ? 'Revocando...' : 'Confirmar Revocación'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revoking, setRevoking] = useState(false);

  const fetchCredentials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAdminCredentials();
      setCredentials(data);
    } catch (err) {
      setError(err.message || 'Error al cargar credenciales');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  const handleRevoke = useCallback(
    async (reason) => {
      if (!revokeTarget) return;
      try {
        setRevoking(true);
        await api.revokeCredential(revokeTarget.credential_hash, reason);
        setRevokeTarget(null);
        // Refresh the list to show updated status.
        fetchCredentials();
      } catch (err) {
        alert(err.message || 'Error al revocar la credencial');
      } finally {
        setRevoking(false);
      }
    },
    [revokeTarget, fetchCredentials]
  );

  // Filtered and searched credentials
  const filtered = useMemo(() => {
    let result = credentials;

    if (filter !== 'all') {
      result = result.filter((c) => c.blockchain_status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.student_name.toLowerCase().includes(q) ||
          c.student_email.toLowerCase().includes(q) ||
          c.course_name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [credentials, filter, search]);

  // Stats
  const stats = useMemo(() => {
    const total = credentials.length;
    const anchored = credentials.filter(
      (c) => c.blockchain_status === 'anchored'
    ).length;
    const revoked = credentials.filter(
      (c) => c.blockchain_status === 'revoked'
    ).length;
    const notAnchored = credentials.filter(
      (c) => c.blockchain_status === 'not_anchored'
    ).length;
    return { total, anchored, revoked, notAnchored };
  }, [credentials]);

  return (
    <div className="admin-page">
      <Header />

      <main className="admin-container">
        {/* Page header */}
        <div className="admin-page-header">
          <h1>Panel de Administración</h1>
          <p className="admin-page-subtitle">
            Gestión de credenciales emitidas · {user?.full_name}
          </p>
        </div>

        {/* Stats */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Credenciales</span>
            <span className="admin-stat-value">{stats.total}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Ancladas</span>
            <span className="admin-stat-value admin-stat-value--success">
              {stats.anchored}
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Revocadas</span>
            <span className="admin-stat-value admin-stat-value--error">
              {stats.revoked}
            </span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Sin Anclar</span>
            <span className="admin-stat-value">{stats.notAnchored}</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Buscar por alumno, email o curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="admin-filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="admin-state-container">
            <div className="admin-state-icon">⏳</div>
            <p className="admin-state-text">Cargando credenciales...</p>
          </div>
        ) : error ? (
          <div className="admin-state-container">
            <p className="admin-error-text">{error}</p>
            <button className="admin-btn-retry" onClick={fetchCredentials}>
              Reintentar
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-state-container">
            <MdSchool className="admin-state-icon" />
            <p className="admin-state-text">
              {search || filter !== 'all'
                ? 'No hay credenciales que coincidan con los filtros.'
                : 'Aún no hay credenciales emitidas.'}
            </p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th>Fecha</th>
                  <th>Calificación</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cred) => (
                  <tr key={cred.credential_hash}>
                    <td>
                      <div className="admin-table-student-name">
                        {cred.student_name}
                      </div>
                      <div className="admin-table-email">
                        {cred.student_email}
                      </div>
                    </td>
                    <td>{cred.course_name}</td>
                    <td>{formatDate(cred.completion_date)}</td>
                    <td>{cred.grade}</td>
                    <td>
                      <StatusBadge status={cred.blockchain_status} />
                      {cred.revoked && cred.revoked_reason && (
                        <div className="admin-revocation-info">
                          {cred.revoked_reason}
                          {cred.revoked_at && (
                            <> · {formatDateTime(cred.revoked_at)}</>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      {cred.blockchain_status === 'anchored' && !cred.revoked ? (
                        <button
                          className="admin-btn-revoke"
                          onClick={() => setRevokeTarget(cred)}
                        >
                          Revocar
                        </button>
                      ) : cred.revoked ? (
                        <span className="admin-revoked-label">Revocada</span>
                      ) : (
                        <span style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />

      {/* Revocation confirmation dialog */}
      {revokeTarget && (
        <RevokeDialog
          credential={revokeTarget}
          onConfirm={handleRevoke}
          onCancel={() => setRevokeTarget(null)}
          loading={revoking}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
