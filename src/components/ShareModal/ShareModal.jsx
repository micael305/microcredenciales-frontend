import { useState } from 'react';
import './ShareModal.css';

function ShareModal({ credential, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!credential) return null;

  const hash = credential.credential_hash || credential.id;
  const shareLink = `${window.location.origin}/verificar/${hash}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="share-modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="share-modal-header">
          <h2 className="share-modal-title">Compartir Credencial</h2>
          <button className="share-modal-close-icon" onClick={onClose}>&times;</button>
        </div>

        <p className="share-modal-text">
          Se ha generado un enlace único para que un tercero pueda verificar la credencial que seleccionaste.
        </p>

        <div className="share-modal-box">
          <p className="share-modal-label">Enlace de Verificación Único:</p>

          <div className="share-input-group">
            <input type="text" readOnly value={shareLink} className="share-input" />
            <button className="share-copy-btn" onClick={handleCopy}>
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          <div className="share-qr-placeholder">
            Código QR — Próximamente
          </div>
        </div>

        <button className="share-close-btn" onClick={onClose}>
          Cerrar
        </button>

      </div>
    </div>
  );
}

export default ShareModal;
