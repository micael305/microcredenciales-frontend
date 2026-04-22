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
        {/* ── Dialog Header ── */}
        <header className="cm-dialog-header">
          <div className="cm-dialog-header__left">
            <div className="cm-dialog-header__icon-circle">
              <span className="cm-dialog-header__icon">🎖</span>
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
          {/* Status & Date */}
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

          {/* Academic Details Table */}
          <section className="cm-section">
            <h3 className="cm-section__heading">Detalles Académicos</h3>
            <div className="cm-table">
              {credential.student_name && (
                <div className="cm-table__row">
                  <span className="cm-table__label">Estudiante</span>
                  <span className="cm-table__value">{credential.student_name}</span>
                </div>
              )}
              <div className="cm-table__row cm-table__row--alt">
                <span className="cm-table__label">Institución</span>
                <span className="cm-table__value">UTN — Facultad Regional Tucumán</span>
              </div>
              {credential.grade && (
                <div className="cm-table__row">
                  <span className="cm-table__label">Calificación</span>
                  <span className="cm-table__value">{credential.grade}</span>
                </div>
              )}
              <div className={`cm-table__row ${credential.grade ? 'cm-table__row--alt' : ''}`}>
                <span className="cm-table__label">Estado</span>
                <span className="cm-table__value">{credential.status === 'claimed' ? 'Guardada' : credential.status === 'issued' ? 'Emitida' : credential.status}</span>
              </div>
            </div>
          </section>

          {/* Visibility Toggle */}
          {onToggleVisibility && (
            <section className="cm-visibility">
              <div className="cm-visibility__left">
                {credential.is_public ? (
                  <MdPublic className="cm-visibility__icon cm-visibility__icon--public" />
                ) : (
                  <MdLock className="cm-visibility__icon" />
                )}
                <div>
                  <span className="cm-visibility__label">
                    Verificación {credential.is_public ? 'Pública' : 'Privada'}
                  </span>
                  <span className="cm-visibility__desc">
                    {credential.is_public
                      ? 'Terceros pueden verificar esta credencial con el enlace público.'
                      : 'Solo tú puedes ver esta credencial.'}
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
            </section>
          )}

          {/* Blockchain Verification */}
          <section className="cm-section">
            <h3 className="cm-section__heading cm-section__heading--icon">
              <MdLock className="cm-section__heading-icon" />
              Verificación Blockchain
            </h3>

            {bc ? (
              <div className="cm-blockchain-card">
                {/* Hash */}
                {credential.credential_hash && (
                  <div className="cm-hash-block">
                    <span className="cm-hash-block__label">Credential Hash (SHA-256)</span>
                    <div className="cm-hash-block__row">
                      <code className="cm-hash-block__code">{truncateHash(credential.credential_hash)}</code>
                      <button
                        className="cm-hash-block__copy"
                        onClick={() => copyToClipboard(credential.credential_hash, setHashCopied)}
                        title={hashCopied ? 'Copiado' : 'Copiar Hash'}
                      >
                        <MdContentCopy />
                      </button>
                    </div>
                  </div>
                )}

                {bc.txn_id && (
                  <div className="cm-hash-block">
                    <span className="cm-hash-block__label">Transaction Hash</span>
                    <div className="cm-hash-block__row">
                      <code className="cm-hash-block__code">{truncateHash(bc.txn_id)}</code>
                      <button
                        className="cm-hash-block__copy"
                        onClick={() => copyToClipboard(bc.txn_id, setTxCopied)}
                        title={txCopied ? 'Copiado' : 'Copiar Hash'}
                      >
                        <MdContentCopy />
                      </button>
                    </div>
                  </div>
                )}

                {/* Network + Explorer */}
                <div className="cm-blockchain-footer">
                  <div className="cm-blockchain-footer__network">
                    <span className="cm-blockchain-footer__network-label">Red {bc.network}</span>
                  </div>
                  {bc.explorer_url && (
                    <a
                      href={bc.explorer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cm-blockchain-footer__explorer"
                    >
                      Ver en explorador
                      <MdOpenInNew className="cm-blockchain-footer__explorer-icon" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="cm-empty-text">Sin datos de blockchain disponibles.</p>
            )}
          </section>
        </div>

        {/* ── Dialog Actions ── */}
        <footer className="cm-dialog-actions">
          <button
            className="cm-action-btn cm-action-btn--outlined"
            onClick={onClose}
          >
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
