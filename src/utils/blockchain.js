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

/**
 * Public verification verdict for third parties.
 *
 * The backend computes the authoritative verdict from the institutional
 * registry plus the on-chain credential state. The presentation layer maps
 * each verdict to a title, tone and explanatory copy so the verifier sees a
 * single, unambiguous result (crucially, a revoked credential is shown as
 * revoked — never as "valid" nor as "not found").
 */
export const VERIFICATION_VERDICT = Object.freeze({
  VALID: 'valid',
  REVOKED: 'revoked',
  NOT_ANCHORED: 'not_anchored',
  NOT_FOUND: 'not_found',
});

const VERDICT_PRESENTATION = {
  [VERIFICATION_VERDICT.VALID]: {
    title: 'Credencial Válida',
    variant: 'success',
    icon: '✓',
    description:
      'La credencial existe en el registro institucional y su anclaje en la blockchain está vigente. Es auténtica y no fue revocada.',
  },
  [VERIFICATION_VERDICT.REVOKED]: {
    title: 'Credencial Revocada',
    variant: 'error',
    icon: '⊘',
    description:
      'La institución emisora revocó esta credencial. Existió y fue auténtica, pero ya no es válida. La revocación queda registrada de forma inmutable en la blockchain.',
  },
  [VERIFICATION_VERDICT.NOT_ANCHORED]: {
    title: 'Credencial Reconocida (sin anclaje confirmado)',
    variant: 'warning',
    icon: '!',
    description:
      'La credencial figura en el registro institucional, pero no se pudo confirmar una prueba on-chain vigente. Reintentá en unos segundos o verificá directamente en el explorador de bloques.',
  },
  [VERIFICATION_VERDICT.NOT_FOUND]: {
    title: 'Credencial No Encontrada',
    variant: 'error',
    icon: '✕',
    description:
      'No se encontró ninguna credencial que corresponda al hash proporcionado. Verificá que el hash sea correcto.',
  },
};

/**
 * Resolve the verdict from a verification response, with a safe fallback for
 * older API payloads that only carried the boolean `valid` flag.
 */
export function resolveVerdict(result) {
  if (result?.verdict && VERDICT_PRESENTATION[result.verdict]) {
    return result.verdict;
  }
  return result?.valid
    ? VERIFICATION_VERDICT.VALID
    : VERIFICATION_VERDICT.NOT_FOUND;
}

export function getVerdictPresentation(verdict) {
  return (
    VERDICT_PRESENTATION[verdict] ||
    VERDICT_PRESENTATION[VERIFICATION_VERDICT.NOT_FOUND]
  );
}

/**
 * Presentation for a credential whose holder keeps it private.
 *
 * The credential exists and is valid, but its owner (the student) chose not
 * to disclose its contents — aligned with the W3C principle of holder
 * sovereignty over their own identity. We confirm existence and validity
 * without revealing any certificate data.
 */
export const PRIVATE_PRESENTATION = Object.freeze({
  title: 'Credencial Privada',
  variant: 'warning',
  icon: '🔒',
  description:
    'Esta credencial existe y es auténtica, pero su titular decidió mantenerla privada. Por respeto a su control sobre su propia identidad, no se muestran los datos del certificado. Solicitá al titular que la haga pública o que te la comparta directamente.',
});
