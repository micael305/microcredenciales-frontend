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
  getBlockchainStatusLabel,
  getBlockchainStatusVariant,
  getBlockchainStatusDescription,
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
