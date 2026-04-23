import { useState, useCallback } from 'react';
import {
  MdClose,
  MdShare,
  MdContentCopy,
  MdOpenInNew,
  MdVerified,
  MdSchool,
  MdAccountBalance,
  MdCalendarToday,
  MdGrade,
  MdPublic,
  MdLock,
  MdLink,
  MdSchedule,
  MdErrorOutline,
} from 'react-icons/md';
import {
  getBlockchainStatusLabel,
  getBlockchainStatusVariant,
  getBlockchainStatusDescription,
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

function formatDateTime(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncateHash(hash) {
  if (!hash || hash.length <= 24) return hash || '';
  return `${hash.slice(0, 14)}…${hash.slice(-12)}`;
}

/* ── Blockchain Evidence Section ── */

function BlockchainSection({ credential, bc, copyToClipboard, hashCopied, txCopied, setHashCopied, setTxCopied }) {
  const bcVariant = bc ? getBlockchainStatusVariant(bc.status) : null;
  const isAnchored = bcVariant === 'success';
  const isPending = credential.status === 'pending' || credential.status === 'issued';

  /* Case 1: Credential not yet claimed — no blockchain data expected */
  if (isPending) {
    return (
      <section className="detail-section">
        <h4 className="detail-section__title">Verificación Blockchain</h4>
        <div className="detail-bc-empty">
          <MdSchedule className="detail-bc-empty__icon" />
          <p className="detail-bc-empty__text">
            Guardá esta credencial en tu wallet escaneando el código QR para
            obtener la verificación criptográfica en la blockchain.
          </p>
        </div>
      </section>
    );
  }

  /* Case 2: Credential claimed but blockchain data unavailable (defensive) */
  if (!bc) {
    return (
      <section className="detail-section">
        <h4 className="detail-section__title">Verificación Blockchain</h4>
        <div className="detail-bc-empty detail-bc-empty--warning">
          <MdErrorOutline className="detail-bc-empty__icon" />
          <p className="detail-bc-empty__text">
            No se pudieron cargar los datos de verificación blockchain.
            Intentá nuevamente en unos segundos.
          </p>
        </div>
      </section>
    );
  }

  /* Case 3: Blockchain evidence available */
  return (
    <section className="detail-section">
      <h4 className="detail-section__title">Verificación Blockchain</h4>
      <div className={`detail-bc-card`}>
        {/* Status badge */}
        <div className="detail-bc-header">
          <div className="detail-tooltip-container">
            <span className={`detail-bc-badge detail-bc-badge--${bcVariant}`}>
              <MdVerified className="detail-bc-badge__icon" />
              {getBlockchainStatusLabel(bc.status)}
            </span>
            <div className="detail-tooltip">
              {getBlockchainStatusDescription(bc.status)}
            </div>
          </div>
        </div>

        {/* Network & timestamp row */}
        <div className="detail-bc-meta">
          {/*<span className="detail-bc-meta__item">
            <MdLink className="detail-bc-meta__icon" />
            {bc.network}
          </span>*/}
          {bc.ledger_timestamp && (
            <span className="detail-bc-meta__item">
              <MdSchedule className="detail-bc-meta__icon" />
              {formatDateTime(bc.ledger_timestamp)}
            </span>
          )}
        </div>

        {/* Credential hash */}
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

        {/* Transaction hash */}
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

        {/* Issuer DID */}
        {bc.issuer_did && (
          <div className="detail-hash-box">
            <span className="detail-hash-label">DID del Emisor</span>
            <code className="detail-hash-code detail-hash-code--subtle">
              {truncateHash(bc.issuer_did)}
            </code>
          </div>
        )}

        {/* Status description (moved to tooltip) */}
        {/* {isAnchored && (
          <p className="detail-bc-description">
            {getBlockchainStatusDescription(bc.status)}
          </p>
        )} */}

        {/* Explorer button — MD3 Tonal Button */}
        {bc.explorer_url && (
          <a
            href={bc.explorer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="detail-explorer-btn"
            id="cm-verify-explorer-btn"
          >
            <MdOpenInNew className="detail-explorer-btn__icon" />
            Verificar en Blockchain Explorer
          </a>
        )}
      </div>
    </section>
  );
}

/* ── Main Modal Component ── */

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

  return (
    <div className="cm-scrim" onClick={onClose}>
      <div
        className="cm-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cm-dialog-title"
      >
        {/* ── Dialog Header ── */}
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

        {/* ── Dialog Content ── */}
        <div className="cm-dialog-content">
          {/* Status Badge & Date Row */}
          <div className="detail-status-row">
            <span className={`detail-status-chip detail-status-chip--${credential.status}`}>
              {credential.status === 'claimed' ? 'Guardada' : credential.status === 'issued' ? 'Emitida' : 'Pendiente'}
            </span>
            <span className="detail-date-text">Otorgada el {formatDate(credential.completion_date)}</span>
          </div>

          <div className="detail-columns">
            {/* ── Left Column: Information ── */}
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

              {/* Visibility Switch */}
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
            <BlockchainSection
              credential={credential}
              bc={bc}
              copyToClipboard={copyToClipboard}
              hashCopied={hashCopied}
              txCopied={txCopied}
              setHashCopied={setHashCopied}
              setTxCopied={setTxCopied}
            />
          </div>
        </div>

        {/* ── Dialog Actions ── */}
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
