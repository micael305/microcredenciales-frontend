import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MdContentCopy, MdClose, MdShare, MdLock } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import './ShareModal.css';

/**
 * Build a LinkedIn "Add to Profile" deep-link (Licenses & Certifications).
 * Same integration the Moodle plugin uses, so sharing is consistent across
 * the LMS and the portal and always points to the public verification URL.
 */
function buildLinkedInUrl({ name, organization, verifyUrl, certId, dateStr }) {
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: name || 'Microcredencial',
    organizationName: organization || 'Universidad Tecnológica Nacional',
    certUrl: verifyUrl,
    certId: String(certId),
  });
  if (dateStr) {
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) {
      params.set('issueYear', String(d.getFullYear()));
      params.set('issueMonth', String(d.getMonth() + 1));
    }
  }
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

function ShareModal({ credential, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!credential) return null;

  const hash = credential.credential_hash || credential.id;
  const shareLink = `${window.location.origin}/verificar/${hash}`;
  // Only warn when the credential is explicitly private; if the flag is absent
  // (older payloads) we don't assume one way or the other.
  const isPrivate = credential.is_public === false;

  const linkedInUrl = buildLinkedInUrl({
    name: credential.course_name,
    organization: credential.issuer,
    verifyUrl: shareLink,
    certId: hash,
    dateStr: credential.completion_date || credential.created_at,
  });

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

          {isPrivate && (
            <div className="share-privacy-hint" role="note">
              <MdLock className="share-privacy-hint__icon" />
              <span>
                Esta credencial es <strong>privada</strong>: quien abra el enlace confirmará que
                existe, pero <strong>no verá tus datos</strong>. Hacela pública desde tu panel para
                mostrar el curso y tu nombre.
              </span>
            </div>
          )}

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
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="share-action-btn share-action-btn--linkedin"
          >
            <FaLinkedin className="share-action-btn__icon" />
            Agregar a LinkedIn
          </a>
        </footer>
      </div>
    </div>
  );
}

export default ShareModal;
