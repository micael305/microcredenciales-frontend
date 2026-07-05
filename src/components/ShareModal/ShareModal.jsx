import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MdContentCopy, MdClose, MdShare, MdLock, MdCheck, MdOpenInNew } from 'react-icons/md';
import { FaLinkedin } from 'react-icons/fa';
import './ShareModal.css';

const DEFAULT_ISSUER = 'Universidad Tecnológica Nacional';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Build a LinkedIn "Add to Profile" deep-link (Licenses & Certifications).
 * NOTE: as of 2025+ LinkedIn no longer auto-fills these fields — the form
 * opens blank and the user types the data. We still pass them (harmless) and,
 * more importantly, surface the same values as copy-to-clipboard rows below.
 */
function buildLinkedInUrl({ name, organization, verifyUrl, certId, dateStr }) {
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: name || 'Microcredencial',
    organizationName: organization || DEFAULT_ISSUER,
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

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
}

function ShareModal({ credential, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!credential) return null;

  const hash = credential.credential_hash || credential.id;
  const shareLink = `${window.location.origin}/verificar/${hash}`;
  // Only warn when the credential is explicitly private; if the flag is absent
  // (older payloads) we don't assume one way or the other.
  const isPrivate = credential.is_public === false;
  const issuer = credential.issuer || DEFAULT_ISSUER;
  const issueDate = credential.completion_date || credential.created_at;

  // Add to Profile (manual fill) deep-link.
  const linkedInUrl = buildLinkedInUrl({
    name: credential.course_name,
    organization: credential.issuer,
    verifyUrl: shareLink,
    certId: hash,
    dateStr: issueDate,
  });

  // Share-as-post: point at the backend Open Graph page so the post renders a
  // rich preview card (the SPA verification page can't, crawlers don't run JS).
  // Clicking it redirects the human to the canonical portal page.
  const ogShareTarget = API_BASE ? `${API_BASE}/api/public/verify/${hash}/embed` : shareLink;
  const postUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ogShareTarget)}`;

  const copyValue = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 2000);
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
                className={`share-copy-btn ${copiedKey === 'link' ? 'share-copy-btn--success' : ''}`}
                onClick={() => copyValue(shareLink, 'link')}
              >
                {copiedKey === 'link' ? <MdCheck /> : <MdContentCopy />}
                <span>{copiedKey === 'link' ? '¡Copiado!' : 'Copiar'}</span>
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

          {/* ── Compartir en LinkedIn ── */}
          <div className="share-linkedin-section">
            <label className="share-label">Compartir en LinkedIn</label>
            <div className="share-linkedin-actions">
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="share-action-btn share-action-btn--linkedin"
              >
                <FaLinkedin className="share-action-btn__icon" />
                Agregar a mi perfil
              </a>
              <a
                href={postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="share-action-btn share-action-btn--tonal"
              >
                <MdOpenInNew className="share-action-btn__icon" />
                Publicar
              </a>
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
