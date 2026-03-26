import { LuDownload } from "react-icons/lu";
import { MdShare } from 'react-icons/md';
import './credentialCard.css';
function CredentialCard({ title, issuer, issueDate, status = 'Activa', onViewDetails }) {

  const statusClass = status.toLowerCase() === 'activa' ? 'status-badge--active' : 'status-badge--inactive';

  return (
    <article className="credential-card">
      <div className="credential-card__header">
        <span className={`status-badge ${statusClass}`}>
          {status}
        </span>
         <div className="credential-card__actions-top">
          <button className="credential-card__action-btn" title="Compartir credencial">
            <MdShare />
          </button>
          <button className="credential-card__action-btn" title="Descargar credencial">
            <LuDownload />
          </button>
        </div>
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
        <a href="#" className="credential-card__link" onClick={(e) => {
          e.preventDefault();
          onViewDetails(); 
        }}>
          Ver Credencial Completa →
        </a>  
      </div>
    </article>
  );
};

export default CredentialCard;