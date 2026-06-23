/**
 * Pruebas unitarias de los helpers de estado de blockchain.
 *
 * Son funciones puras (entrada -> salida, sin efectos secundarios): el caso
 * ideal para pruebas unitarias rápidas. Verifican que cada estado del backend
 * se traduzca a la etiqueta, el "tono" (variant) y la descripción correctos,
 * y que un estado desconocido caiga en valores por defecto seguros.
 */
import { describe, it, expect } from 'vitest';

import {
  BLOCKCHAIN_STATUS,
  VERIFICATION_VERDICT,
  getBlockchainStatusLabel,
  getBlockchainStatusVariant,
  getBlockchainStatusDescription,
  resolveVerdict,
  getVerdictPresentation,
} from './blockchain.js';

describe('getBlockchainStatusLabel', () => {
  it('devuelve la etiqueta correcta para cada estado conocido', () => {
    expect(getBlockchainStatusLabel(BLOCKCHAIN_STATUS.ANCHORED)).toBe('Verificada en Blockchain');
    expect(getBlockchainStatusLabel(BLOCKCHAIN_STATUS.PENDING_ANCHORING)).toBe('Pendiente de anclaje');
    expect(getBlockchainStatusLabel(BLOCKCHAIN_STATUS.REVOKED)).toBe('Revocada');
    expect(getBlockchainStatusLabel(BLOCKCHAIN_STATUS.UNAVAILABLE)).toBe('Blockchain no disponible');
  });

  it('cae en un valor por defecto ante un estado desconocido', () => {
    expect(getBlockchainStatusLabel('estado_raro')).toBe('Estado desconocido');
  });
});

describe('getBlockchainStatusVariant', () => {
  it('mapea cada estado a su tono visual', () => {
    expect(getBlockchainStatusVariant(BLOCKCHAIN_STATUS.ANCHORED)).toBe('success');
    expect(getBlockchainStatusVariant(BLOCKCHAIN_STATUS.PENDING_ANCHORING)).toBe('pending');
    expect(getBlockchainStatusVariant(BLOCKCHAIN_STATUS.REVOKED)).toBe('error');
    expect(getBlockchainStatusVariant(BLOCKCHAIN_STATUS.UNAVAILABLE)).toBe('warning');
  });

  it('usa "default" ante un estado desconocido', () => {
    expect(getBlockchainStatusVariant('estado_raro')).toBe('default');
  });
});

describe('getBlockchainStatusDescription', () => {
  it('devuelve una descripción no vacía para un estado conocido', () => {
    expect(getBlockchainStatusDescription(BLOCKCHAIN_STATUS.ANCHORED).length).toBeGreaterThan(0);
  });

  it('devuelve string vacío ante un estado desconocido', () => {
    expect(getBlockchainStatusDescription('estado_raro')).toBe('');
  });
});

describe('BLOCKCHAIN_STATUS', () => {
  it('es un objeto congelado (no se puede mutar por accidente)', () => {
    expect(Object.isFrozen(BLOCKCHAIN_STATUS)).toBe(true);
  });
});

describe('robustez ante entradas inválidas', () => {
  it('null y undefined caen en los valores por defecto', () => {
    expect(getBlockchainStatusLabel(null)).toBe('Estado desconocido');
    expect(getBlockchainStatusLabel(undefined)).toBe('Estado desconocido');
    expect(getBlockchainStatusVariant(null)).toBe('default');
    expect(getBlockchainStatusDescription(null)).toBe('');
  });
});

describe('cobertura de todos los estados', () => {
  it('cada estado definido tiene etiqueta, variante y descripción propias', () => {
    for (const status of Object.values(BLOCKCHAIN_STATUS)) {
      expect(getBlockchainStatusLabel(status)).not.toBe('Estado desconocido');
      expect(getBlockchainStatusVariant(status)).not.toBe('default');
      expect(getBlockchainStatusDescription(status).length).toBeGreaterThan(0);
    }
  });

  it('la descripción menciona la blockchain en los estados relevantes', () => {
    expect(getBlockchainStatusDescription(BLOCKCHAIN_STATUS.ANCHORED).toLowerCase())
      .toContain('blockchain');
    expect(getBlockchainStatusDescription(BLOCKCHAIN_STATUS.REVOKED).toLowerCase())
      .toContain('revoc');
  });
});

describe('resolveVerdict', () => {
  it('prioriza el campo verdict del backend cuando está presente', () => {
    expect(resolveVerdict({ verdict: 'revoked', valid: false })).toBe(VERIFICATION_VERDICT.REVOKED);
    expect(resolveVerdict({ verdict: 'not_anchored', valid: false })).toBe(VERIFICATION_VERDICT.NOT_ANCHORED);
  });

  it('cae al flag booleano valid en payloads antiguos sin verdict', () => {
    expect(resolveVerdict({ valid: true })).toBe(VERIFICATION_VERDICT.VALID);
    expect(resolveVerdict({ valid: false })).toBe(VERIFICATION_VERDICT.NOT_FOUND);
  });

  it('es robusto ante null/undefined', () => {
    expect(resolveVerdict(null)).toBe(VERIFICATION_VERDICT.NOT_FOUND);
    expect(resolveVerdict(undefined)).toBe(VERIFICATION_VERDICT.NOT_FOUND);
  });

  it('ignora un verdict desconocido y usa el flag valid', () => {
    expect(resolveVerdict({ verdict: 'marciano', valid: true })).toBe(VERIFICATION_VERDICT.VALID);
  });
});

describe('getVerdictPresentation', () => {
  it('cada veredicto tiene título, variante, icono y descripción', () => {
    for (const verdict of Object.values(VERIFICATION_VERDICT)) {
      const p = getVerdictPresentation(verdict);
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.variant.length).toBeGreaterThan(0);
      expect(p.icon.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
    }
  });

  it('una credencial revocada NO se presenta con tono de éxito', () => {
    expect(getVerdictPresentation(VERIFICATION_VERDICT.REVOKED).variant).toBe('error');
    expect(getVerdictPresentation(VERIFICATION_VERDICT.VALID).variant).toBe('success');
  });

  it('cae en la presentación NOT_FOUND ante un veredicto desconocido', () => {
    expect(getVerdictPresentation('marciano').title).toBe(
      getVerdictPresentation(VERIFICATION_VERDICT.NOT_FOUND).title
    );
  });
});

describe('VERIFICATION_VERDICT', () => {
  it('es un objeto congelado', () => {
    expect(Object.isFrozen(VERIFICATION_VERDICT)).toBe(true);
  });
});
