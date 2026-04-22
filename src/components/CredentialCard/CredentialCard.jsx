import { MdShare, MdOpenInNew, MdVerified, MdPublic } from 'react-icons/md';
import './credentialCard.css';

/**
 * MD3 Outlined Card for displaying a credential summary.
 *
 * Props:
 *   title      – Course name
 *   issuer     – Issuing institution label
 *   issueDate  – Formatted date string
 *   status     – Localized status label (Emitida, Guardada, Pendiente)
 *   isPublic   – Whether the credential is publicly verifiable
 *   isAnchored – Whether the credential is anchored on-chain
 *   onViewDetails – Click handler for the detail action
 *   onShare       – Click handler for the share action
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
  let statusClass = 'status-badge--active';
  if (statusLower === 'pendiente') statusClass = 'status-badge--pending';
  else if (statusLower === 'guardada') statusClass = 'status-badge--claimed';

  return (
    <article className="credential-card" id={`credential-card-${title}`}>
      {/* ── Header: Status + Indicators + Share ── */}
      <div className="credential-card__header">
        <span className={`status-badge ${statusClass}`}>
          {status}
        </span>
        <div className="credential-card__indicators">
          {isAnchored && (
            <span className="credential-card__indicator credential-card__indicator--blockchain" title="Verificada en Blockchain">
              <MdVerified />
            </span>
          )}
          {isPublic && (
            <span className="credential-card__indicator credential-card__indicator--public" title="Verificación pública activa">
              <MdPublic />
            </span>
          )}
          <button
            className="credential-card__action-btn"
            title="Compartir credencial"
            onClick={onShare}
            aria-label="Compartir credencial"
          >
            <MdShare />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="credential-card__body">
        <h3 className="credential-card__title">{title}</h3>
        <p className="credential-card__issuer">{issuer}</p>
        <p className="credential-card__date">
          <span className="credential-card__date-label">Emisión: </span>
          {issueDate}
        </p>
      </div>

      {/* ── Footer ── */}
      <div className="credential-card__footer">
        <button className="credential-card__link" onClick={onViewDetails}>
          Ver Detalle
          <MdOpenInNew style={{ marginLeft: '4px', fontSize: '0.85em' }} />
        </button>
      </div>
    </article>
  );
}

export default CredentialCard;
