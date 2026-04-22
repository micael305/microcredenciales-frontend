import { useState, useCallback } from 'react';
import {
  MdClose,
  MdShare,
  MdContentCopy,
  MdOpenInNew,
  MdVerified,
  MdCalendarToday,
  MdSchool,
  MdGrade,
  MdAccountBalance,
} from 'react-icons/md';
import { getBlockchainStatusLabel, getBlockchainStatusVariant } from '../../utils/blockchain';
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="detail-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-dialog-title"
      >
        {/* ── Top App Bar ── */}
        <header className="detail-appbar">
          <button
            className="detail-appbar__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <MdClose />
          </button>
          <h2 className="detail-appbar__title" id="detail-dialog-title">
            Detalle de Credencial
          </h2>
          <div className="detail-appbar__actions">
            {onShare && (
              <button
                className="detail-appbar__action"
                onClick={() => onShare(credential)}
                aria-label="Compartir"
                title="Compartir"
              >
                <MdShare />
              </button>
            )}
          </div>
        </header>

        {/* ── Scrollable Content ── */}
        <div className="detail-body">
          {/* ── Hero Section ── */}
          <div className="detail-hero">
            <h3 className="detail-hero__title">{credential.course_name}</h3>
            <p className="detail-hero__subtitle">
              UTN — Facultad Regional Tucumán
            </p>
            <span className={`detail-status-chip detail-status-chip--${credential.status}`}>
              {displayStatus}
            </span>
          </div>

          {/* ── 2-Column Content Area ── */}
          <div className="detail-columns">
            {/* ── Left: Credential Info ── */}
            <section className="detail-section">
              <h4 className="detail-section__title">Información</h4>

              <ul className="detail-list">
                {credential.student_name && (
                  <li className="detail-list__item">
                    <MdSchool className="detail-list__icon" />
                    <div className="detail-list__text">
                      <span className="detail-list__overline">Alumno</span>
                      <span className="detail-list__headline">{credential.student_name}</span>
                    </div>
                  </li>
                )}
                <li className="detail-list__item">
                  <MdAccountBalance className="detail-list__icon" />
                  <div className="detail-list__text">
                    <span className="detail-list__overline">Institución Emisora</span>
                    <span className="detail-list__headline">UTN — FRT</span>
                  </div>
                </li>
                <li className="detail-list__item">
                  <MdCalendarToday className="detail-list__icon" />
                  <div className="detail-list__text">
                    <span className="detail-list__overline">Fecha de Emisión</span>
                    <span className="detail-list__headline">
                      {formatDate(credential.completion_date)}
                    </span>
                  </div>
                </li>
                {credential.grade && (
                  <li className="detail-list__item">
                    <MdGrade className="detail-list__icon" />
                    <div className="detail-list__text">
                      <span className="detail-list__overline">Calificación</span>
                      <span className="detail-list__headline">{credential.grade}</span>
                    </div>
                  </li>
                )}
              </ul>
            </section>

            {/* ── Right: Blockchain Evidence ── */}
            {bc && (
              <section className="detail-section">
                <h4 className="detail-section__title">Verificación Blockchain</h4>

                <div className="detail-bc-status">
                  <span className={`detail-bc-badge detail-bc-badge--${bcVariant}`}>
                    <MdVerified className="detail-bc-badge__icon" />
                    {getBlockchainStatusLabel(bc.status)}
                  </span>
                </div>

                <ul className="detail-list">
                  <li className="detail-list__item">
                    <div className="detail-list__text">
                      <span className="detail-list__overline">Red</span>
                      <span className="detail-list__headline">{bc.network}</span>
                    </div>
                  </li>
                  {bc.ledger_timestamp && (
                    <li className="detail-list__item">
                      <div className="detail-list__text">
                        <span className="detail-list__overline">Timestamp On-Chain</span>
                        <span className="detail-list__headline">
                          {formatDate(bc.ledger_timestamp)}
                        </span>
                      </div>
                    </li>
                  )}
                  {bc.issuer_did && (
                    <li className="detail-list__item">
                      <div className="detail-list__text">
                        <span className="detail-list__overline">DID del Emisor</span>
                        <span className="detail-list__headline detail-mono">
                          {truncateHash(bc.issuer_did)}
                        </span>
                      </div>
                    </li>
                  )}
                  {bc.txn_id && (
                    <li className="detail-list__item">
                      <div className="detail-list__text">
                        <span className="detail-list__overline">Transaction Hash</span>
                        <div className="detail-inline-copy">
                          <span className="detail-list__headline detail-mono">
                            {truncateHash(bc.txn_id)}
                          </span>
                          <button
                            className="detail-copy-btn"
                            onClick={() => copyToClipboard(bc.txn_id, setTxCopied)}
                            aria-label="Copiar transaction hash"
                          >
                            <MdContentCopy />
                            <span>{txCopied ? 'Copiado' : 'Copiar'}</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>

                {bc.explorer_url && (
                  <a
                    href={bc.explorer_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="detail-explorer-btn"
                  >
                    Verificar en Explorer
                    <MdOpenInNew />
                  </a>
                )}
              </section>
            )}
          </div>

          {/* ── Visibility Switch ── */}
          {onToggleVisibility && (
            <div className="detail-switch-row">
              <div className="detail-switch-row__text">
                <span className="detail-switch-row__label">Verificación pública</span>
                <span className="detail-switch-row__support">
                  {credential.is_public
                    ? 'Cualquier persona puede verificar esta credencial'
                    : 'Solo tú puedes ver esta credencial'}
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

          {/* ── Credential Hash ── */}
          {credential.credential_hash && (
            <div className="detail-hash-section">
              <span className="detail-list__overline">Huella Digital (SHA-256)</span>
              <div className="detail-inline-copy">
                <code className="detail-hash-value">
                  {credential.credential_hash}
                </code>
                <button
                  className="detail-copy-btn"
                  onClick={() => copyToClipboard(credential.credential_hash, setHashCopied)}
                  aria-label="Copiar hash"
                >
                  <MdContentCopy />
                  <span>{hashCopied ? 'Copiado' : 'Copiar'}</span>
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
