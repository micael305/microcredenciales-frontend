import { useState, useCallback } from 'react';
import {
  MdClose,
  MdShare,
  MdContentCopy,
  MdOpenInNew,
  MdVerified,
  MdCheckCircle,
  MdSchool,
  MdAccountBalance,
  MdCalendarToday,
  MdGrade,
  MdPublic,
  MdLock,
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
        {/* ── Dialog Header (Current Style) ── */}
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

        {/* ── Dialog Content (Commit 0921e2d Style + Compact Grid) ── */}
        <div className="cm-dialog-content">
          {/* Status Badge & Date Row */}
          <div className="detail-status-row">
            <span className={`detail-status-chip detail-status-chip--${credential.status}`}>
              {credential.status === 'claimed' ? 'Guardada' : credential.status === 'issued' ? 'Emitida' : 'Pendiente'}
            </span>
            <span className="detail-date-text">Otorgada el {formatDate(credential.completion_date)}</span>
          </div>

          <div className="detail-columns">
            {/* ── Left Column: Information (Optimized Compact Grid) ── */}
            <section className="detail-section">
              <h4 className="detail-section__title">Información</h4>
              <div className="detail-info-grid">
                {credential.student_name && (
                  <div className="detail-info-item">
                    <div className="detail-info-item__header">
                      <MdSchool className="detail-info-item__icon" />
                      <span className="detail-info-item__label">Alumno</span>
                    </div>
                    <span className="detail-info-item__value">{credential.student_name}</span>
                  </div>
                )}
                <div className="detail-info-item">
                  <div className="detail-info-item__header">
                    <MdAccountBalance className="detail-info-item__icon" />
                    <span className="detail-info-item__label">Institución</span>
                  </div>
                  <span className="detail-info-item__value">UTN — FRT</span>
                </div>
                <div className="detail-info-item">
                  <div className="detail-info-item__header">
                    <MdCalendarToday className="detail-info-item__icon" />
                    <span className="detail-info-item__label">Emisión</span>
                  </div>
                  <span className="detail-info-item__value">{formatDate(credential.completion_date)}</span>
                </div>
                {credential.grade && (
                  <div className="detail-info-item">
                    <div className="detail-info-item__header">
                      <MdGrade className="detail-info-item__icon" />
                      <span className="detail-info-item__label">Calificación</span>
                    </div>
                    <span className="detail-info-item__value">{credential.grade}</span>
                  </div>
                )}
              </div>

              {/* Visibility Switch (Integrated into Info Section) */}
              {onToggleVisibility && (
                <div className="detail-visibility-box">
                  <div className="detail-visibility-text">
                    <span className="detail-visibility-label">
                      {credential.is_public ? <MdPublic /> : <MdLock />}
                      {credential.is_public ? 'Pública' : 'Privada'}
                    </span>
                    <span className="detail-visibility-help">
                      {credential.is_public ? 'Visible para terceros' : 'Solo visible para ti'}
                    </span>
                  </div>
                  <button
                    role="switch"
                    aria-checked={credential.is_public}
                    className={`detail-switch ${credential.is_public ? 'detail-switch--on' : ''}`}
                    onClick={() => onToggleVisibility(credential)}
                  >
                    <span className="detail-switch__track">
                      <span className="detail-switch__thumb" />
                    </span>
                  </button>
                </div>
              )}
            </section>

            {/* ── Right Column: Blockchain ── */}
            <section className="detail-section">
              <h4 className="detail-section__title">Verificación Blockchain</h4>
              {bc ? (
                <div className="detail-bc-card">
                  <div className="detail-bc-header">
                    <span className={`detail-bc-badge detail-bc-badge--${bcVariant}`}>
                      <MdVerified className="detail-bc-badge__icon" />
                      {getBlockchainStatusLabel(bc.status)}
                    </span>
                    <span className="detail-bc-network">Red {bc.network}</span>
                  </div>

                  {credential.credential_hash && (
                    <div className="detail-hash-box">
                      <span className="detail-hash-label">Huella Digital (SHA-256)</span>
                      <div className="detail-hash-row">
                        <code className="detail-hash-code">{truncateHash(credential.credential_hash)}</code>
                        <button
                          className="detail-copy-btn-mini"
                          onClick={() => copyToClipboard(credential.credential_hash, setHashCopied)}
                          title="Copiar Hash"
                        >
                          <MdContentCopy />
                          {hashCopied && <span className="copy-feedback">¡Listo!</span>}
                        </button>
                      </div>
                    </div>
                  )}

                  {bc.txn_id && (
                    <div className="detail-hash-box">
                      <span className="detail-hash-label">Transaction Hash</span>
                      <div className="detail-hash-row">
                        <code className="detail-hash-code">{truncateHash(bc.txn_id)}</code>
                        <button
                          className="detail-copy-btn-mini"
                          onClick={() => copyToClipboard(bc.txn_id, setTxCopied)}
                          title="Copiar Tx Hash"
                        >
                          <MdContentCopy />
                          {txCopied && <span className="copy-feedback">¡Listo!</span>}
                        </button>
                      </div>
                    </div>
                  )}

                  {bc.explorer_url && (
                    <a
                      href={bc.explorer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-explorer-link"
                    >
                      Verificar en Explorer
                      <MdOpenInNew />
                    </a>
                  )}
                </div>
              ) : (
                <p className="detail-empty-text">Sin datos de blockchain disponibles.</p>
              )}
            </section>
          </div>
        </div>

        {/* ── Dialog Actions (Current Style) ── */}
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
