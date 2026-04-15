import './credentialModal.css';

function CredentialModal({ credential, onClose }) {
  if (!credential) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="btn-link" onClick={onClose}>&lt;   Volver</button>

        <h2 className="modal-title">{credential.title}</h2>
        <p className="modal-description">{credential.description}</p>

        <div className="modal-grid">
          <div className="modal-grid-item">
            <span className="modal-label">Institución Emisora</span>
            <span className="modal-value">{credential.issuer}</span>
          </div>
          <div className="modal-grid-item">
            <span className="modal-label">Emisor</span>
            <span className="modal-value">{credential.department}</span>
          </div>
          <div className="modal-grid-item">
            <span className="modal-label">Fecha de Emisión</span>
            <span className="modal-value">{credential.issueDate}</span>
          </div>
          <div className="modal-grid-item">
            <span className="modal-label">Estado</span>
            <span className="modal-value modal-status-active">{credential.status}</span>
          </div>
        </div>

        <div className="modal-hash-box">
          <span className="modal-label modal-label--dark">Hash de Transacción Blockchain (Verificación Raíz)</span>
          <span className="modal-value modal-hash-text">{credential.hash}</span>
        </div>

      </div>
    </div>
  );
}

export default CredentialModal;