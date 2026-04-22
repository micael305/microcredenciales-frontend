import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MdContentCopy, MdClose, MdShare } from 'react-icons/md';
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
    <div className="share-scrim" onClick={onClose}>
      <div
        className="share-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
      >
        {/* ── Header (MD3 Shell Style) ── */}
        <header className="share-header">
          <div className="share-header__left">
            <div className="share-header__icon-circle">
              <MdShare className="share-header__icon" />
            </div>
            <div className="share-header__text">
              <h2 className="share-header__title" id="share-title">
                Compartir Credencial
              </h2>
              <p className="share-header__subtitle">Enlace de verificación pública</p>
            </div>
          </div>
          <button className="share-header__close" onClick={onClose} aria-label="Cerrar">
            <MdClose />
          </button>
        </header>

        {/* ── Body ── */}
        <div className="share-body">
          <p className="share-description">
            Cualquier persona con este enlace podrá verificar la autenticidad de tu credencial
            en el registro institucional y en la blockchain.
          </p>

          <div className="share-link-section">
            <label className="share-label">Enlace Directo</label>
            <div className="share-input-group">
              <input type="text" readOnly value={shareLink} className="share-input" />
              <button 
                className={`share-copy-btn ${copied ? 'share-copy-btn--success' : ''}`}
                onClick={handleCopy}
              >
                <MdContentCopy />
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          <div className="share-qr-section">
            <label className="share-label">Código QR</label>
            <div className="share-qr-card">
              <QRCodeSVG
                value={shareLink}
                size={160}
                level="M"
                marginSize={2}
                fgColor="var(--md-sys-color-on-surface)"
                bgColor="transparent"
              />
            </div>
          </div>
        </div>

        {/* ── Actions (Footer) ── */}
        <footer className="share-actions">
          <button className="share-action-btn share-action-btn--tonal" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}

export default ShareModal;
