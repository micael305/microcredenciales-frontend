import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MdOpenInNew,
  MdVerified,
  MdContentCopy,
  MdLink,
  MdSchedule,
  MdErrorOutline,
} from 'react-icons/md';
import * as api from '../../api/client';
import {
  getBlockchainStatusLabel,
  getBlockchainStatusVariant,
  getBlockchainStatusDescription,
} from '../../utils/blockchain';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './VerificacionPublica.css';

/* ── Helpers ── */

function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateHash(hash) {
  if (!hash || hash.length <= 20) return hash || '';
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

/* ── Blockchain Evidence Block ── */

function BlockchainEvidence({ bc }) {
  const bcVariant = bc ? getBlockchainStatusVariant(bc.status) : null;

  if (!bc) {
    return (
      <div className="verificacion-details">
        <div className="verificacion-bc-empty">
          <MdErrorOutline className="verificacion-bc-empty__icon" />
          <p className="verificacion-bc-empty__text">
            La credencial existe en el registro institucional pero no se
            encontraron datos de verificación en la blockchain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="verificacion-details">
      <div className="verificacion-bc-badge-row">
        <span className={`verificacion-status-badge verificacion-status-badge--${bcVariant}`}>
          <MdVerified style={{ fontSize: '1rem', marginRight: '4px' }} />
          {getBlockchainStatusLabel(bc.status)}
        </span>
      </div>

      {/* Network & timestamp meta */}
      <div className="verificacion-bc-meta">
        <span className="verificacion-bc-meta__item">
          <MdLink className="verificacion-bc-meta__icon" />
          {bc.network}
        </span>
        {bc.ledger_timestamp && (
          <span className="verificacion-bc-meta__item">
            <MdSchedule className="verificacion-bc-meta__icon" />
            {formatDateTime(bc.ledger_timestamp)}
          </span>
        )}
      </div>

      {bc.issuer_did && (
        <div className="verificacion-data">
          <span className="verificacion-label">DID del Emisor</span>
          <span className="verificacion-value verificacion-hash">
            {truncateHash(bc.issuer_did)}
          </span>
        </div>
      )}
      {bc.txn_id && (
        <div className="verificacion-data">
          <span className="verificacion-label">Transaction Hash</span>
          {bc.explorer_url ? (
            <a
              href={bc.explorer_url}
              target="_blank"
              rel="noopener noreferrer"
              className="verificacion-value verificacion-hash verificacion-tx-link"
            >
              {truncateHash(bc.txn_id)}
            </a>
          ) : (
            <span className="verificacion-value verificacion-hash">
              {truncateHash(bc.txn_id)}
            </span>
          )}
        </div>
      )}

      {/* Status description */}
      <p className="verificacion-bc-description">
        {getBlockchainStatusDescription(bc.status)}
      </p>

      {/* Explorer button — MD3 Tonal Button */}
      {bc.explorer_url && (
        <a
          href={bc.explorer_url}
          target="_blank"
          rel="noopener noreferrer"
          className="verificacion-explorer-link"
          id="public-verify-explorer-btn"
        >
          <MdOpenInNew />
          Verificar en Blockchain Explorer
        </a>
      )}
    </div>
  );
}

/* ── Page Component ── */

function VerificacionPublica() {
  const { hash } = useParams();
  const navigate = useNavigate();
  const [searchHash, setSearchHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hashCopied, setHashCopied] = useState(false);

  useEffect(() => {
    if (hash) {
      verify(hash);
    }
  }, [hash]);

  const verify = async (hashToVerify) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.publicVerify(hashToVerify);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al verificar la credencial');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchHash.trim();
    if (!trimmed) return;
    navigate(`/verificar/${trimmed}`);
  };

  const handleCopyHash = useCallback(() => {
    if (!result?.credential_hash) return;
    navigator.clipboard.writeText(result.credential_hash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  }, [result]);

  return (
    <div className="verificacion-page">
      <Header />

      <div className="verificacion-container">
        {/* ── Search Card ── */}
        <div className="verificacion-card">
          <h2 className="verificacion-title">Verificación Pública de Credenciales</h2>
          <p className="verificacion-text">
            Ingresá el hash de una credencial para consultar su estado en el
            registro institucional y en la blockchain.
          </p>
          <form onSubmit={handleSearch} className="verificacion-search-form" id="verification-form">
            <input
              type="text"
              placeholder="Pegar hash de la credencial..."
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="verificacion-search-input"
              id="verification-hash-input"
            />
            <button
              type="submit"
              className="verificacion-search-btn"
              disabled={loading}
              id="verification-submit-btn"
            >
              {loading ? 'Validando...' : 'Verificar'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="verificacion-card">
            <p className="verificacion-text">Validando credencial...</p>
          </div>
        )}

        {error && (
          <div className="verificacion-card">
            <div className="verificacion-icon verificacion-icon--error">✕</div>
            <p className="verificacion-text">{error}</p>
          </div>
        )}

        {/* ── Result Card ── */}
        {result && !loading && (
          <div className="verificacion-card">
            {result.valid ? (
              <>
                <div className="verificacion-icon">✓</div>
                <h2 className="verificacion-title">Credencial Reconocida</h2>

                {/* ── 2-Column Result Layout ── */}
                <div className="verificacion-result-columns">
                  {/* Left: Credential data */}
                  <div className="verificacion-details">
                    {result.student_name && (
                      <div className="verificacion-data">
                        <span className="verificacion-label">Alumno</span>
                        <span className="verificacion-value">{result.student_name}</span>
                      </div>
                    )}
                    {result.course_name && (
                      <div className="verificacion-data">
                        <span className="verificacion-label">Curso</span>
                        <span className="verificacion-value">{result.course_name}</span>
                      </div>
                    )}
                    {result.completion_date && (
                      <div className="verificacion-data">
                        <span className="verificacion-label">Fecha de Emisión</span>
                        <span className="verificacion-value">
                          {formatDate(result.completion_date)}
                        </span>
                      </div>
                    )}
                    {result.issuer && (
                      <div className="verificacion-data">
                        <span className="verificacion-label">Institución Emisora</span>
                        <span className="verificacion-value">{result.issuer}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Blockchain evidence */}
                  <BlockchainEvidence bc={result.blockchain} />
                </div>

                {/* ── Hash Box ── */}
                <div className="verificacion-hash-box">
                  <span className="verificacion-label">Huella Digital (SHA-256)</span>
                  <div className="verificacion-hash-row">
                    <code className="verificacion-hash-value">
                      {result.credential_hash}
                    </code>
                    <button
                      className="verificacion-copy-btn"
                      onClick={handleCopyHash}
                      aria-label="Copiar hash"
                    >
                      <MdContentCopy />
                      {hashCopied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="verificacion-icon verificacion-icon--error">✕</div>
                <h2 className="verificacion-title">Credencial No Encontrada</h2>
                <p className="verificacion-text">
                  No se encontró ninguna credencial que corresponda al hash proporcionado.
                  Verificá que el hash sea correcto.
                </p>
                <div className="verificacion-hash-box">
                  <span className="verificacion-label">Hash Consultado</span>
                  <code className="verificacion-hash-value">
                    {result.credential_hash}
                  </code>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default VerificacionPublica;
