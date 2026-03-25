import './credentialCard.css';
function CredentialCard({ title, issuer, issueDate, status = 'Activa' }) {

    const statusClass = status.toLowerCase() === 'activa' ? 'status-badge--active' : 'status-badge--inactive';

  return (
    <article className="credential-card">
      <div className="credential-card__header">
        {/* Insignia de estado */}
        <span className={`status-badge ${statusClass}`}>
          {status}
        </span>
        {/* Checkbox superior derecho */}
        <input type="checkbox" className="credential-card__checkbox" />
      </div>

      <div className="credential-card__body">
        <h3 className="credential-card__title">{title}</h3>
        <p className="credential-card__issuer">{issuer}</p>
        <p className="credential-card__date">
          <span className="credential-card__date-label">Fecha de Emisión: </span>
          {issueDate}
        </p>
      </div>

      <div className="credential-card__footer">
        {/* Enlace simulado (puedes cambiarlo por <Link> de react-router si lo usas) */}
        <a href="#" className="credential-card__link" onClick={(e) => e.preventDefault()}>
          Ver Credencial Completa →
        </a>
      </div>
    </article>
  );
};

export default CredentialCard;