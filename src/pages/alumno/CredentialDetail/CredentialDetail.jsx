import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdArrowBack,
  MdShare,
  MdContentCopy,
  MdOpenInNew,
  MdSchool,
  MdAccountBalance,
  MdCalendarToday,
  MdGrade,
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext';
import * as api from '../../../api/client';
import {
  getBlockchainStatusLabel,
  getBlockchainStatusVariant,
} from '../../../utils/blockchain';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import ShareModal from '../../../components/ShareModal/ShareModal';
import './credentialDetail.css';

/* ── Helpers ── */

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function truncateHash(hash) {
  if (!hash || hash.length <= 20) return hash || '';
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

/* ── Page Component ── */

function CredentialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);
  const [txCopied, setTxCopied] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        // Try verify endpoint first (includes blockchain data)
        const data = await api.verifyCredential(id);
        setCredential(data);
      } catch {
        try {
          const data = await api.getCredentialDetail(id);
          setCredential(data);
        } catch (err) {
          setError(err.message || 'Error al cargar la credencial');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const handleToggleVisibility = useCallback(async () => {
    if (!credential) return;
    const newValue = !credential.is_public;
    try {
      await api.toggleVisibility(credential.credential_hash, newValue);
      setCredential((prev) => ({ ...prev, is_public: newValue }));
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  }, [credential]);

  const copyToClipboard = useCallback((text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }, []);

  const bc = credential?.blockchain;
  const bcVariant = bc ? getBlockchainStatusVariant(bc.status) : null;

  if (loading) {
    return (
      <div className="detail-page">
        <Header />
        <main className="detail-main">
          <p className="detail-loading">Cargando credencial…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !credential) {
    return (
      <div className="detail-page">
        <Header />
        <main className="detail-main">
          <p className="detail-error">{error || 'Credencial no encontrada'}</p>
          <button className="detail-back-btn" onClick={() => navigate('/alumno')}>
            <MdArrowBack /> Volver al Dashboard
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Header />

      <main className="detail-main">
        {/* ── Page Header ── */}
        <div className="detail-page-header">
          <div className="detail-page-header__left">
            <button className="detail-back-link" onClick={() => navigate('/alumno')}>
              <MdArrowBack />
              <span>Mis Credenciales</span>
            </button>
            <h1 className="detail-page-title">Detalle de Credencial</h1>
            <p className="detail-page-subtitle">
              Verificación criptográfica y datos académicos.
            </p>
          </div>
          <div className="detail-page-header__actions">
            <button
              className="detail-btn-outline"
              onClick={() => setShowShare(true)}
            >
              <MdShare />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="detail-bento">
          {/* ── Left Column (8/12) ── */}
          <div className="detail-bento__main">
            {/* Hero Card */}
            <div className="detail-hero-card">
              <div className="detail-hero-card__icon">
                <MdSchool />
              </div>
              <div className="detail-hero-card__content">
                <div className="detail-hero-card__badges">
                  {bc && bcVariant === 'success' && (
                    <span className="detail-verified-badge">
                      ✓ Verificado
                    </span>
                  )}
                  <span className="detail-type-label">Micro-credencial</span>
                </div>
                <h2 className="detail-hero-card__title">{credential.course_name}</h2>
                <p className="detail-hero-card__issuer">UTN — Facultad Regional Tucumán</p>
              </div>
            </div>

            {/* Academic Details List */}
            <div className="detail-data-card">
              <div className="detail-data-card__header">
                <h3 className="detail-data-card__title">Detalles Académicos</h3>
              </div>
              <ul className="detail-data-list">
                {credential.student_name && (
                  <li className="detail-data-list__item">
                    <div className="detail-data-list__left">
                      <MdSchool className="detail-data-list__icon" />
                      <span className="detail-data-list__label">Alumno</span>
                    </div>
                    <span className="detail-data-list__value">{credential.student_name}</span>
                  </li>
                )}
                <li className="detail-data-list__item">
                  <div className="detail-data-list__left">
                    <MdAccountBalance className="detail-data-list__icon" />
                    <span className="detail-data-list__label">Institución Emisora</span>
                  </div>
                  <span className="detail-data-list__value">UTN — FRT</span>
                </li>
                <li className="detail-data-list__item">
                  <div className="detail-data-list__left">
                    <MdCalendarToday className="detail-data-list__icon" />
                    <span className="detail-data-list__label">Fecha de Emisión</span>
                  </div>
                  <span className="detail-data-list__value">
                    {formatDate(credential.completion_date)}
                  </span>
                </li>
                {credential.grade && (
                  <li className="detail-data-list__item">
                    <div className="detail-data-list__left">
                      <MdGrade className="detail-data-list__icon" />
                      <span className="detail-data-list__label">Calificación</span>
                    </div>
                    <span className="detail-data-list__value">{credential.grade}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Blockchain Evidence (desktop: inside main column on large screens) */}
            {bc && (
              <div className="detail-data-card detail-bc-card-mobile">
                <div className="detail-data-card__header">
                  <h3 className="detail-data-card__title">Evidencia Blockchain</h3>
                </div>
                <div className="detail-bc-badge-row">
                  <span className={`detail-bc-badge detail-bc-badge--${bcVariant}`}>
                    {getBlockchainStatusLabel(bc.status)}
                  </span>
                </div>
                <ul className="detail-data-list">
                  <li className="detail-data-list__item">
                    <div className="detail-data-list__left">
                      <span className="detail-data-list__label">Red</span>
                    </div>
                    <span className="detail-data-list__value">{bc.network}</span>
                  </li>
                  {bc.ledger_timestamp && (
                    <li className="detail-data-list__item">
                      <div className="detail-data-list__left">
                        <span className="detail-data-list__label">Timestamp</span>
                      </div>
                      <span className="detail-data-list__value">
                        {formatDate(bc.ledger_timestamp)}
                      </span>
                    </li>
                  )}
                  {bc.issuer_did && (
                    <li className="detail-data-list__item">
                      <div className="detail-data-list__left">
                        <span className="detail-data-list__label">DID Emisor</span>
                      </div>
                      <span className="detail-data-list__value detail-mono">
                        {truncateHash(bc.issuer_did)}
                      </span>
                    </li>
                  )}
                  {bc.txn_id && (
                    <li className="detail-data-list__item">
                      <div className="detail-data-list__left">
                        <span className="detail-data-list__label">Tx Hash</span>
                      </div>
                      <div className="detail-inline-copy">
                        <span className="detail-data-list__value detail-mono">
                          {truncateHash(bc.txn_id)}
                        </span>
                        <button
                          className="detail-icon-btn"
                          onClick={() => copyToClipboard(bc.txn_id, setTxCopied)}
                          title={txCopied ? 'Copiado' : 'Copiar'}
                        >
                          <MdContentCopy />
                        </button>
                      </div>
                    </li>
                  )}
                </ul>
                {bc.explorer_url && (
                  <a
                    href={bc.explorer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-explorer-btn"
                  >
                    <MdOpenInNew />
                    Ver en Blockchain Explorer
                  </a>
                )}
              </div>
            )}
          </div>

          {/* ── Right Column (4/12) ── */}
          <div className="detail-bento__side">
            {/* Privacy Switch */}
            <div className="detail-privacy-card">
              <div className="detail-privacy-card__text">
                <h3 className="detail-privacy-card__title">Verificación Pública</h3>
                <p className="detail-privacy-card__desc">
                  {credential.is_public
                    ? 'Terceros pueden verificar esta credencial.'
                    : 'Solo tú puedes ver esta credencial.'}
                </p>
              </div>
              <button
                role="switch"
                aria-checked={credential.is_public}
                className={`detail-switch ${credential.is_public ? 'detail-switch--on' : ''}`}
                onClick={handleToggleVisibility}
              >
                <span className="detail-switch__track">
                  <span className="detail-switch__thumb" />
                </span>
              </button>
            </div>

            {/* Hash Card */}
            {credential.credential_hash && (
              <div className="detail-data-card">
                <div className="detail-data-card__header detail-data-card__header--icon">
                  <span className="detail-fingerprint-icon">🔑</span>
                  <h3 className="detail-data-card__title">Huella Digital (SHA-256)</h3>
                </div>
                <div className="detail-hash-content">
                  <div className="detail-hash-box">
                    <code className="detail-hash-code">
                      {credential.credential_hash}
                    </code>
                    <button
                      className="detail-icon-btn"
                      onClick={() => copyToClipboard(credential.credential_hash, setHashCopied)}
                      title={hashCopied ? 'Copiado' : 'Copiar'}
                    >
                      <MdContentCopy />
                    </button>
                  </div>
                  {bc?.explorer_url && (
                    <a
                      href={bc.explorer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-explorer-btn detail-explorer-btn--full"
                    >
                      <MdOpenInNew />
                      Ver en Blockchain Explorer
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Blockchain Evidence (desktop sidebar) */}
            {bc && (
              <div className="detail-data-card detail-bc-card-desktop">
                <div className="detail-data-card__header">
                  <h3 className="detail-data-card__title">Evidencia Blockchain</h3>
                </div>
                <div className="detail-bc-badge-row">
                  <span className={`detail-bc-badge detail-bc-badge--${bcVariant}`}>
                    {getBlockchainStatusLabel(bc.status)}
                  </span>
                </div>
                <ul className="detail-data-list detail-data-list--compact">
                  <li className="detail-data-list__item">
                    <span className="detail-data-list__label">Red</span>
                    <span className="detail-data-list__value detail-data-list__value--small">
                      {bc.network}
                    </span>
                  </li>
                  {bc.ledger_timestamp && (
                    <li className="detail-data-list__item">
                      <span className="detail-data-list__label">Timestamp</span>
                      <span className="detail-data-list__value">
                        {formatDate(bc.ledger_timestamp)}
                      </span>
                    </li>
                  )}
                  {bc.txn_id && (
                    <li className="detail-data-list__item">
                      <span className="detail-data-list__label">Tx Hash</span>
                      <div className="detail-inline-copy">
                        <span className="detail-data-list__value detail-mono">
                          {truncateHash(bc.txn_id)}
                        </span>
                        <button
                          className="detail-icon-btn"
                          onClick={() => copyToClipboard(bc.txn_id, setTxCopied)}
                          title={txCopied ? 'Copiado' : 'Copiar'}
                        >
                          <MdContentCopy />
                        </button>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Share Modal */}
      <ShareModal
        credential={showShare ? credential : null}
        onClose={() => setShowShare(false)}
      />
    </div>
  );
}

export default CredentialDetail;
