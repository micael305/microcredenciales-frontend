/**
 * Domain helpers for the `blockchain` evidence object returned by the API.
 *
 * The backend drives state via the `status` field; this module keeps the
 * presentation layer in sync with a single source of truth for labels,
 * tone ("variant") and explanatory copy, so components can stay dumb.
 */

export const BLOCKCHAIN_STATUS = Object.freeze({
  PENDING_ANCHORING: 'pending_anchoring',
  ANCHORED: 'anchored',
  REVOKED: 'revoked',
  UNAVAILABLE: 'unavailable',
});

const STATUS_LABELS = {
  [BLOCKCHAIN_STATUS.ANCHORED]: 'Verificada en Blockchain',
  [BLOCKCHAIN_STATUS.PENDING_ANCHORING]: 'Pendiente de anclaje',
  [BLOCKCHAIN_STATUS.REVOKED]: 'Revocada',
  [BLOCKCHAIN_STATUS.UNAVAILABLE]: 'Blockchain no disponible',
};

const STATUS_VARIANTS = {
  [BLOCKCHAIN_STATUS.ANCHORED]: 'success',
  [BLOCKCHAIN_STATUS.PENDING_ANCHORING]: 'pending',
  [BLOCKCHAIN_STATUS.REVOKED]: 'error',
  [BLOCKCHAIN_STATUS.UNAVAILABLE]: 'warning',
};

const STATUS_DESCRIPTIONS = {
  [BLOCKCHAIN_STATUS.ANCHORED]:
    'La credencial tiene un registro inmutable en la blockchain Hyperledger Besu, verificable públicamente a través del explorador de bloques.',
  [BLOCKCHAIN_STATUS.PENDING_ANCHORING]:
    'La credencial existe en el registro institucional. El anclaje en la blockchain se ejecuta como parte de la cadena de emisión.',
  [BLOCKCHAIN_STATUS.REVOKED]:
    'La credencial fue revocada por la institución emisora. El registro de revocación es inmutable en la blockchain.',
  [BLOCKCHAIN_STATUS.UNAVAILABLE]:
    'La blockchain no respondió a la consulta. Reintentá en unos segundos.',
};

export function getBlockchainStatusLabel(status) {
  return STATUS_LABELS[status] || 'Estado desconocido';
}

export function getBlockchainStatusVariant(status) {
  return STATUS_VARIANTS[status] || 'default';
}

export function getBlockchainStatusDescription(status) {
  return STATUS_DESCRIPTIONS[status] || '';
}
