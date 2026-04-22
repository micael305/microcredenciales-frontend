import { useState } from 'react';
import { MdContentCopy, MdOpenInNew, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { getBlockchainStatusLabel, getBlockchainStatusVariant } from '../../utils/blockchain';
import './credentialModal.css';

function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const STATUS_LABELS = {
  issued: 'Emitida',
  claimed: 'Guardada',
  pending: 'Pendiente',
};

/**
 * Truncate a hex hash for display: first 10 + last 8 chars.
 * @param {string} hash
 * @returns {string}
 */
function truncateHash(hash) {
  if (!hash || hash.length <= 20) return hash || '';
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

function CredentialModal({ credential, onClose, onToggleVisibility }) {
  const [hashCopied, setHashCopied] = useState(false);
  const [txCopied, setTxCopied] = useState(false);

  if (!credential) return null;

  const displayStatus = STATUS_LABELS[credential.status] || credential.status;
  const blockchain = credential.blockchain;
  const blockchainVariant = blockchain ? getBlockchainStatusVariant(blockchain.status) : null;

  const handleCopyHash = () => {
    if (!credential.credential_hash) return;
    navigator.clipboard.writeText(credential.credential_hash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };

  const handleCopyTx = () => {
    if (!blockchain?.txn_id) return;
    navigator.clipboard.writeText(blockchain.txn_id);
    setTxCopied(true);
    setTimeout(() => setTxCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top-bar">
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar detalle">
            ← Volver
          </button>
          {onToggleVisibility && (
            <button
              className="modal-visibility-btn"
              onClick={() => onToggleVisibility(credential)}
              title={credential.is_public ? 'Hacer privada' : 'Hacer pública'}
              aria-label={credential.is_public ? 'Hacer privada' : 'Hacer pública'}
            >
              {credential.is_public ? <MdVisibility /> : <MdVisibilityOff />}
              <span>{credential.is_public ? 'Pública' : 'Privada'}</span>
            </button>
          )}
        </div>

        <h2 className="modal-title">{credential.course_name}</h2>

        <div className="modal-grid">
          <div className="modal-grid-item">
            <span className="modal-label">Institución Emisora</span>
            <span className="modal-value">UTN — Facultad Regional Tucumán</span>
          </div>
          {credential.student_name && (
            <div className="modal-grid-item">
              <span className="modal-label">Alumno</span>
              <span className="modal-value">{credential.student_name}</span>
            </div>
          )}
          <div className="modal-grid-item">
            <span className="modal-label">Fecha de Emisión</span>
            <span className="modal-value">{formatDate(credential.completion_date)}</span>
          </div>
          <div className="modal-grid-item">
            <span className="modal-label">Estado</span>
            <span className="modal-value">{displayStatus}</span>
          </div>
          {credential.grade && (
            <div className="modal-grid-item">
              <span className="modal-label">Calificación</span>
              <span className="modal-value">{credential.grade}</span>
            </div>
          )}
        </div>

        {/* ── Blockchain Evidence Section ── */}
        {blockchain && (
          <div className="modal-blockchain-section">
            <h3 className="modal-section-title">Evidencia Blockchain</h3>
            <div className="modal-grid">
              <div className="modal-grid-item">
                <span className="modal-label">Red</span>
                <span className="modal-value">{blockchain.network}</span>
              </div>
              <div className="modal-grid-item">
                <span className="modal-label">Estado on-chain</span>
                <span className={`modal-blockchain-badge modal-blockchain-badge--${blockchainVariant}`}>
                  {getBlockchainStatusLabel(blockchain.status)}
                </span>
              </div>
              {blockchain.issuer_did && (
                <div className="modal-grid-item modal-grid-item--full">
                  <span className="modal-label">DID del Emisor</span>
                  <span className="modal-value modal-mono">{blockchain.issuer_did}</span>
                </div>
              )}
              {blockchain.ledger_timestamp && (
                <div className="modal-grid-item">
                  <span className="modal-label">Timestamp On-Chain</span>
                  <span className="modal-value">{formatDate(blockchain.ledger_timestamp)}</span>
                </div>
              )}
              {blockchain.txn_id && (
                <div className="modal-grid-item modal-grid-item--full">
                  <span className="modal-label">Transaction Hash</span>
                  <div className="modal-hash-row">
                    <span className="modal-value modal-mono modal-hash-text">
                      {truncateHash(blockchain.txn_id)}
                    </span>
                    <button
                      className="modal-copy-btn"
                      onClick={handleCopyTx}
                      title="Copiar transaction hash"
                      aria-label="Copiar transaction hash"
                    >
                      <MdContentCopy />
                      {txCopied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {blockchain.explorer_url && (
              <a
                href={blockchain.explorer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-explorer-link"
              >
                <MdOpenInNew />
                Verificar en Blockchain Explorer
              </a>
            )}
          </div>
        )}

        {/* ── Hash Section ── */}
        {credential.credential_hash && (
          <div className="modal-hash-box">
            <span className="modal-label">Hash de la Credencial (SHA-256)</span>
            <p className="modal-hash-help">
              Este hash identifica de forma única a esta credencial. Es el mismo valor registrado
              en la blockchain — puede verificarlo en el Explorer.
            </p>
            <div className="modal-hash-row">
              <span className="modal-value modal-mono modal-hash-text">
                {credential.credential_hash}
              </span>
              <button
                className="modal-copy-btn"
                onClick={handleCopyHash}
                title="Copiar hash"
                aria-label="Copiar hash"
              >
                <MdContentCopy />
                {hashCopied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CredentialModal;
