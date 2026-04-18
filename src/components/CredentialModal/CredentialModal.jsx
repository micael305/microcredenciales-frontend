import { getBlockchainStatusLabel } from '../../utils/blockchain';
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

function CredentialModal({ credential, onClose }) {
  if (!credential) return null;

  const displayStatus = STATUS_LABELS[credential.status] || credential.status;
  const blockchain = credential.blockchain;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="btn-link" onClick={onClose}>&lt;   Volver</button>

        <h2 className="modal-title">{credential.course_name}</h2>

        <div className="modal-grid">
          <div className="modal-grid-item">
            <span className="modal-label">Institución Emisora</span>
            <span className="modal-value">UTN-FRT</span>
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
            <span className="modal-value modal-status-active">{displayStatus}</span>
          </div>
          {credential.grade && (
            <div className="modal-grid-item">
              <span className="modal-label">Calificación</span>
              <span className="modal-value">{credential.grade}</span>
            </div>
          )}
          {blockchain && (
            <div className="modal-grid-item">
              <span className="modal-label">Estado on-ledger</span>
              <span className="modal-value">
                {getBlockchainStatusLabel(blockchain.status)}
              </span>
            </div>
          )}
        </div>

        {credential.credential_hash && (
          <div className="modal-hash-box">
            <span className="modal-label modal-label--dark">
              Hash de la credencial
            </span>
            <span className="modal-value modal-hash-text">
              {credential.credential_hash}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CredentialModal;
