import { MdShare, MdSchool, MdAccountBalance, MdCalendarToday } from 'react-icons/md';
import './credentialCard.css';

/**
 * MD3 Outlined Card for credential summary.
 *
 * Follows mockup: icon top-left, status badge top-right,
 * course info in body, solid primary "Ver Detalles" button in footer.
 */
function CredentialCard({
  title,
  issuer,
  issueDate,
  status = 'Emitida',
  isPublic = false,
  isAnchored = false,
  onViewDetails,
  onShare,
}) {
  const statusLower = status.toLowerCase();
  let statusClass = 'cred-badge--active';
  let statusIcon = '✓';
  if (statusLower === 'pendiente') {
    statusClass = 'cred-badge--pending';
    statusIcon = '⏳';
  } else if (statusLower === 'guardada') {
    statusClass = 'cred-badge--claimed';
    statusIcon = '💾';
  }

  return (
    <article className="cred-card" id={`credential-card-${title}`}>
      {/* ── Header: Icon + Badge ── */}
      <div className="cred-card__header">
        <div className="cred-card__icon">
          <MdSchool />
        </div>
        <span className={`cred-badge ${statusClass}`}>
          <span className="cred-badge__icon">{statusIcon}</span>
          {status}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="cred-card__body">
        <h3 className="cred-card__title">{title}</h3>
        <p className="cred-card__meta">
          <MdAccountBalance className="cred-card__meta-icon" />
          {issuer}
        </p>
        <p className="cred-card__meta">
          <MdCalendarToday className="cred-card__meta-icon" />
          Emitida: {issueDate}
        </p>
      </div>

      {/* ── Footer ── */}
      <div className="cred-card__footer">
        <button className="cred-card__btn-primary" onClick={onViewDetails}>
          Ver Detalles
        </button>
        <button
          className="cred-card__btn-icon"
          onClick={onShare}
          aria-label="Compartir credencial"
          title="Compartir"
        >
          <MdShare />
        </button>
      </div>
    </article>
  );
}

export default CredentialCard;
