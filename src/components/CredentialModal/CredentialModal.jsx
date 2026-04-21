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

function CredentialModal({ credential, onClose, onToggleVisibility }) {
  const [hashCopied, setHashCopied] = useState(false);

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
              {blockchain.txn_id && (
                <div className="modal-grid-item modal-grid-item--full">
                  <span className="modal-label">Transaction ID</span>
                  <span className="modal-value modal-mono">{blockchain.txn_id}</span>
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
                Ver en Blockchain Explorer
              </a>
            )}
          </div>
        )}

        {/* ── Hash Section ── */}
        {credential.credential_hash && (
          <div className="modal-hash-box">
            <span className="modal-label">Hash de la Credencial (SHA-256)</span>
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
