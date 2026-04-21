import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MdContentCopy } from 'react-icons/md';
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
          <button className="share-modal-close-icon" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <p className="share-modal-text">
          Cualquier persona con este enlace podrá verificar la autenticidad de tu credencial
          en el registro institucional y en la blockchain.
        </p>

        <div className="share-modal-box">
          <p className="share-modal-label">Enlace de Verificación:</p>
          <div className="share-input-group">
            <input type="text" readOnly value={shareLink} className="share-input" />
            <button className="share-copy-btn" onClick={handleCopy}>
              <MdContentCopy />
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>

          <div className="share-qr-container">
            <QRCodeSVG
              value={shareLink}
              size={180}
              level="M"
              marginSize={2}
              fgColor="#181C20"
              bgColor="#FFFFFF"
            />
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
