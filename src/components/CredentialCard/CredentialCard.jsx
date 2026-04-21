import { MdShare, MdOpenInNew } from 'react-icons/md';
import './credentialCard.css';

function CredentialCard({ title, issuer, issueDate, status = 'Emitida', onViewDetails, onShare }) {
  const statusLower = status.toLowerCase();
  let statusClass = 'status-badge--active';
  if (statusLower === 'pendiente') statusClass = 'status-badge--pending';
  else if (statusLower === 'guardada') statusClass = 'status-badge--claimed';

  return (
    <article className="credential-card" id={`credential-card-${title}`}>
      <div className="credential-card__header">
        <span className={`status-badge ${statusClass}`}>
          {status}
        </span>
        <div className="credential-card__actions-top">
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

      <div className="credential-card__body">
        <h3 className="credential-card__title">{title}</h3>
        <p className="credential-card__issuer">{issuer}</p>
        <p className="credential-card__date">
          <span className="credential-card__date-label">Emisión: </span>
          {issueDate}
        </p>
      </div>

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
