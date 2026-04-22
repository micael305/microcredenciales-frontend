import { useState, useCallback } from 'react';
import {
  MdClose,
  MdShare,
  MdContentCopy,
  MdOpenInNew,
  MdSchool,
  MdAccountBalance,
  MdCalendarToday,
  MdGrade,
  MdPublic,
  MdLock,
  MdVerified,
} from 'react-icons/md';
import {
  getBlockchainStatusLabel,
  getBlockchainStatusVariant,
} from '../../utils/blockchain';
import './credentialModal.css';

/* ── Helpers ── */

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function truncateHash(hash) {
  if (!hash || hash.length <= 20) return hash || '';
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`;
}

const STATUS_LABELS = {
  issued: 'Emitida',
  claimed: 'Guardada',
  pending: 'Pendiente',
};

/* ── Component ── */

function CredentialModal({
  credential,
  onClose,
  onToggleVisibility,
  onShare,
}) {
  const [hashCopied, setHashCopied] = useState(false);
  const [txCopied, setTxCopied] = useState(false);

  const copyToClipboard = useCallback((text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }, []);

  if (!credential) return null;

  const displayStatus = STATUS_LABELS[credential.status] || credential.status;
  const bc = credential.blockchain;
  const bcVariant = bc ? getBlockchainStatusVariant(bc.status) : null;
  const isVerified = bcVariant === 'success';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="cm-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cm-title"
      >
        {/* ── Header ── */}
        <header className="cm-header">
          <div className="cm-header__left">
            <button className="cm-header__close" onClick={onClose} aria-label="Cerrar">
              <MdClose />
            </button>
            <h2 className="cm-header__title" id="cm-title">Detalle de Credencial</h2>
          </div>
          <div className="cm-header__actions">
            {onShare && (
              <button
                className="cm-header__action"
                onClick={() => onShare(credential)}
                aria-label="Compartir"
                title="Compartir"
              >
                <MdShare />
              </button>
            )}
          </div>
        </header>

        {/* ── Body ── */}
        <div className="cm-body">
          {/* ── Hero ── */}
          <div className="cm-hero">
            <div className="cm-hero__icon">
              <MdSchool />
            </div>
            <div className="cm-hero__info">
              <div className="cm-hero__badges">
                {isVerified && (
                  <span className="cm-badge-verified">
                    <MdVerified className="cm-badge-verified__icon" />
                    Verificada
                  </span>
                )}
                <span className={`cm-badge-status cm-badge-status--${credential.status}`}>
                  {displayStatus}
                </span>
              </div>
              <h3 className="cm-hero__title">{credential.course_name}</h3>
              <p className="cm-hero__subtitle">UTN — Facultad Regional Tucumán</p>
            </div>
          </div>

          {/* ── Two Column Content ── */}
          <div className="cm-columns">
            {/* Left: Academic + Privacy */}
            <div className="cm-col">
              <div className="cm-section">
                <h4 className="cm-section__title">Información Académica</h4>
                <ul className="cm-list">
                  {credential.student_name && (
                    <li className="cm-list__item">
                      <MdSchool className="cm-list__icon" />
                      <span className="cm-list__label">Alumno</span>
                      <span className="cm-list__value">{credential.student_name}</span>
                    </li>
                  )}
                  <li className="cm-list__item">
                    <MdAccountBalance className="cm-list__icon" />
                    <span className="cm-list__label">Emisor</span>
                    <span className="cm-list__value">UTN — FRT</span>
                  </li>
                  <li className="cm-list__item">
                    <MdCalendarToday className="cm-list__icon" />
                    <span className="cm-list__label">Emisión</span>
                    <span className="cm-list__value">{formatDate(credential.completion_date)}</span>
                  </li>
                  {credential.grade && (
                    <li className="cm-list__item">
                      <MdGrade className="cm-list__icon" />
                      <span className="cm-list__label">Calificación</span>
                      <span className="cm-list__value">{credential.grade}</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Privacy Switch */}
              {onToggleVisibility && (
                <div className="cm-privacy">
                  <div className="cm-privacy__left">
                    {credential.is_public ? (
                      <MdPublic className="cm-privacy__icon cm-privacy__icon--public" />
                    ) : (
                      <MdLock className="cm-privacy__icon" />
                    )}
                    <div className="cm-privacy__text">
                      <span className="cm-privacy__label">
                        {credential.is_public ? 'Pública' : 'Privada'}
                      </span>
                      <span className="cm-privacy__desc">
                        {credential.is_public
                          ? 'Verificable por terceros'
                          : 'Solo visible para ti'}
                      </span>
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={credential.is_public}
                    className={`cm-switch ${credential.is_public ? 'cm-switch--on' : ''}`}
                    onClick={() => onToggleVisibility(credential)}
                  >
                    <span className="cm-switch__track">
                      <span className="cm-switch__thumb" />
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Blockchain */}
            <div className="cm-col">
              {bc ? (
                <div className="cm-section">
                  <h4 className="cm-section__title">Blockchain</h4>
                  <div className="cm-bc">
                    <span className={`cm-bc__badge cm-bc__badge--${bcVariant}`}>
                      {getBlockchainStatusLabel(bc.status)}
                    </span>

                    <div className="cm-bc__details">
                      <div className="cm-bc__row">
                        <span className="cm-bc__label">Red</span>
                        <span className="cm-bc__value">{bc.network}</span>
                      </div>
                      {bc.ledger_timestamp && (
                        <div className="cm-bc__row">
                          <span className="cm-bc__label">Timestamp</span>
                          <span className="cm-bc__value">{formatDate(bc.ledger_timestamp)}</span>
                        </div>
                      )}
                      {bc.issuer_did && (
                        <div className="cm-bc__row">
                          <span className="cm-bc__label">DID Emisor</span>
                          <span className="cm-bc__value cm-mono">{truncateHash(bc.issuer_did)}</span>
                        </div>
                      )}
                      {bc.txn_id && (
                        <div className="cm-bc__row">
                          <span className="cm-bc__label">Tx Hash</span>
                          <div className="cm-bc__copyable">
                            <span className="cm-bc__value cm-mono">{truncateHash(bc.txn_id)}</span>
                            <button
                              className="cm-copy-btn"
                              onClick={() => copyToClipboard(bc.txn_id, setTxCopied)}
                              title={txCopied ? 'Copiado' : 'Copiar'}
                            >
                              <MdContentCopy />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {bc.explorer_url && (
                      <a
                        href={bc.explorer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cm-explorer-link"
                      >
                        <MdOpenInNew />
                        Ver en Explorer
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="cm-section">
                  <h4 className="cm-section__title">Blockchain</h4>
                  <p className="cm-empty-text">Sin datos de blockchain disponibles.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Hash Footer ── */}
          {credential.credential_hash && (
            <div className="cm-hash">
              <span className="cm-hash__label">Huella Digital (SHA-256)</span>
              <div className="cm-hash__row">
                <code className="cm-hash__code">{credential.credential_hash}</code>
                <button
                  className="cm-copy-btn"
                  onClick={() => copyToClipboard(credential.credential_hash, setHashCopied)}
                  title={hashCopied ? 'Copiado' : 'Copiar hash'}
                >
                  <MdContentCopy />
                  <span className="cm-copy-btn__text">{hashCopied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CredentialModal;
