import { useState, useCallback } from 'react';
import {
  MdClose,
  MdShare,
  MdContentCopy,
  MdOpenInNew,
  MdVerified,
  MdCheckCircle,
  MdPublic,
  MdLock,
  MdSchool,
  MdAccountBalance,
  MdCalendarToday,
  MdGrade,
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
    month: 'short',
    year: 'numeric',
  });
}

function truncateHash(hash) {
  if (!hash || hash.length <= 24) return hash || '';
  return `${hash.slice(0, 14)}…${hash.slice(-12)}`;
}

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

  const bc = credential.blockchain;
  const bcVariant = bc ? getBlockchainStatusVariant(bc.status) : null;
  const isVerified = bcVariant === 'success';

  return (
    <div className="cm-scrim" onClick={onClose}>
      <div
        className="cm-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cm-dialog-title"
      >
        {/* ── Dialog Header (mockup style) ── */}
        <header className="cm-dialog-header">
          <div className="cm-dialog-header__left">
            <div className="cm-dialog-header__icon-circle">
              <MdSchool className="cm-dialog-header__school-icon" />
            </div>
            <div className="cm-dialog-header__text">
              <h2 className="cm-dialog-header__title" id="cm-dialog-title">
                {credential.course_name}
              </h2>
              <p className="cm-dialog-header__subtitle">
                <MdVerified className="cm-dialog-header__verified" />
                Emitido por UTN FRT
              </p>
            </div>
          </div>
          <button className="cm-dialog-header__close" onClick={onClose} aria-label="Cerrar">
            <MdClose />
          </button>
        </header>

        {/* ── Dialog Content (2-column compact layout) ── */}
        <div className="cm-dialog-content">
          {/* Status Row */}
          <div className="cm-status-row">
            {isVerified && (
              <span className="cm-chip cm-chip--valid">
                <MdCheckCircle className="cm-chip__icon" />
                Válida
              </span>
            )}
            <span className="cm-status-date">
              Otorgada el {formatDate(credential.completion_date)}
            </span>
          </div>

          {/* ── Two Columns ── */}
          <div className="cm-columns">
            {/* Left Column: Academic Info + Visibility */}
            <div className="cm-col">
              <h3 className="cm-col__heading">Información Académica</h3>
              <ul className="cm-info-list">
                {credential.student_name && (
                  <li className="cm-info-list__item">
                    <MdSchool className="cm-info-list__icon" />
                    <div>
                      <span className="cm-info-list__label">Alumno</span>
                      <span className="cm-info-list__value">{credential.student_name}</span>
                    </div>
                  </li>
                )}
                <li className="cm-info-list__item">
                  <MdAccountBalance className="cm-info-list__icon" />
                  <div>
                    <span className="cm-info-list__label">Emisor</span>
                    <span className="cm-info-list__value">UTN — FRT</span>
                  </div>
                </li>
                <li className="cm-info-list__item">
                  <MdCalendarToday className="cm-info-list__icon" />
                  <div>
                    <span className="cm-info-list__label">Emisión</span>
                    <span className="cm-info-list__value">{formatDate(credential.completion_date)}</span>
                  </div>
                </li>
                {credential.grade && (
                  <li className="cm-info-list__item">
                    <MdGrade className="cm-info-list__icon" />
                    <div>
                      <span className="cm-info-list__label">Calificación</span>
                      <span className="cm-info-list__value">{credential.grade}</span>
                    </div>
                  </li>
                )}
              </ul>

              {/* Visibility Toggle */}
              {onToggleVisibility && (
                <div className="cm-visibility">
                  <div className="cm-visibility__left">
                    {credential.is_public ? (
                      <MdPublic className="cm-visibility__icon cm-visibility__icon--public" />
                    ) : (
                      <MdLock className="cm-visibility__icon" />
                    )}
                    <span className="cm-visibility__label">
                      {credential.is_public ? 'Pública' : 'Privada'}
                    </span>
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

            {/* Right Column: Blockchain */}
            <div className="cm-col">
              <h3 className="cm-col__heading">Blockchain</h3>
              {bc ? (
                <div className="cm-bc-card">
                  <span className={`cm-bc-badge cm-bc-badge--${bcVariant}`}>
                    {getBlockchainStatusLabel(bc.status)}
                  </span>

                  {credential.credential_hash && (
                    <div className="cm-hash-block">
                      <span className="cm-hash-block__label">Hash (SHA-256)</span>
                      <div className="cm-hash-block__row">
                        <code className="cm-hash-block__code">{truncateHash(credential.credential_hash)}</code>
                        <button
                          className="cm-hash-block__copy"
                          onClick={() => copyToClipboard(credential.credential_hash, setHashCopied)}
                          title={hashCopied ? 'Copiado' : 'Copiar'}
                        >
                          <MdContentCopy />
                        </button>
                      </div>
                    </div>
                  )}

                  {bc.txn_id && (
                    <div className="cm-hash-block">
                      <span className="cm-hash-block__label">Tx Hash</span>
                      <div className="cm-hash-block__row">
                        <code className="cm-hash-block__code">{truncateHash(bc.txn_id)}</code>
                        <button
                          className="cm-hash-block__copy"
                          onClick={() => copyToClipboard(bc.txn_id, setTxCopied)}
                          title={txCopied ? 'Copiado' : 'Copiar'}
                        >
                          <MdContentCopy />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="cm-bc-footer">
                    <span className="cm-bc-footer__net">Red {bc.network}</span>
                    {bc.explorer_url && (
                      <a
                        href={bc.explorer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cm-bc-footer__link"
                      >
                        Ver en Explorer
                        <MdOpenInNew className="cm-bc-footer__link-icon" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <p className="cm-empty-text">Sin datos de blockchain.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Dialog Actions (mockup style) ── */}
        <footer className="cm-dialog-actions">
          <button className="cm-action-btn cm-action-btn--outlined" onClick={onClose}>
            Cerrar
          </button>
          {onShare && (
            <button
              className="cm-action-btn cm-action-btn--filled"
              onClick={() => onShare(credential)}
            >
              <MdShare className="cm-action-btn__icon" />
              Compartir
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

export default CredentialModal;
