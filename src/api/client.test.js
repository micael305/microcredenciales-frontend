// @vitest-environment jsdom
/**
 * Pruebas unitarias del cliente de API del portal.
 *
 * `client.js` es la capa que habla con el backend. Concentra lógica sensible:
 * agrega la cabecera de autenticación, cierra la sesión ante un 401, traduce
 * errores HTTP a excepciones y arma las URLs de cada endpoint. Acá se prueba
 * todo eso simulando `fetch` (no se hace ninguna llamada real de red).
 *
 * Usa el entorno jsdom para tener `localStorage` y `window` como en el navegador.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import * as api from './client.js';

// El cliente antepone VITE_API_BASE_URL (si está definido en .env) a cada ruta.
// Lo contemplamos para que las aserciones de URL no dependan del entorno.
const BASE = import.meta.env.VITE_API_BASE_URL || '';

/** Simula una respuesta de fetch para la próxima llamada. */
function mockFetchOnce({ ok = true, status = 200, data = {} } = {}) {
  globalThis.fetch.mockResolvedValueOnce({
    ok,
    status,
    json: async () => data,
  });
}

beforeEach(() => {
  localStorage.clear();
  globalThis.fetch = vi.fn();
  // Reemplazamos window.location por un objeto simple para capturar redirecciones
  // sin que jsdom intente "navegar".
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { href: '' },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('manejo del token (localStorage)', () => {
  it('setToken / getToken / clearToken', () => {
    expect(api.getToken()).toBeNull();
    api.setToken('abc123');
    expect(api.getToken()).toBe('abc123');
    api.clearToken();
    expect(api.getToken()).toBeNull();
  });
});

describe('cabecera de autenticación', () => {
  it('incluye Authorization: Bearer <token> cuando hay sesión', async () => {
    api.setToken('TKN');
    mockFetchOnce({ data: [] });

    await api.getCredentials();

    const [, config] = globalThis.fetch.mock.calls[0];
    expect(config.headers.Authorization).toBe('Bearer TKN');
  });

  it('NO incluye Authorization en endpoints públicos (skipAuth)', async () => {
    api.setToken('TKN');
    mockFetchOnce({ data: { valid: true } });

    await api.publicVerify('hash');

    const [, config] = globalThis.fetch.mock.calls[0];
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('no agrega Authorization si no hay token', async () => {
    mockFetchOnce({ data: {} });

    await api.getMe();

    const [, config] = globalThis.fetch.mock.calls[0];
    expect(config.headers.Authorization).toBeUndefined();
  });
});

describe('manejo de errores', () => {
  it('ante 401 cierra la sesión y redirige al login', async () => {
    api.setToken('TKN');
    mockFetchOnce({ ok: false, status: 401 });

    await expect(api.getMe()).rejects.toThrow('Sesión expirada');
    expect(api.getToken()).toBeNull();          // token borrado
    expect(window.location.href).toBe('/login'); // redirección
  });

  it('ante error con detalle, lanza ese mensaje', async () => {
    mockFetchOnce({ ok: false, status: 400, data: { detail: 'Credenciales inválidas' } });

    await expect(api.login('a@b.com', 'x')).rejects.toThrow('Credenciales inválidas');
  });

  it('ante error sin detalle, lanza "Error <status>"', async () => {
    mockFetchOnce({ ok: false, status: 500, data: {} });

    await expect(api.getStats()).rejects.toThrow('Error 500');
  });

  it('ante respuesta OK, devuelve el JSON parseado', async () => {
    mockFetchOnce({ data: { name: 'Ada' } });

    const res = await api.getMe();
    expect(res).toEqual({ name: 'Ada' });
  });
});

describe('construcción de los endpoints', () => {
  it('login: POST al endpoint correcto con el body esperado', async () => {
    mockFetchOnce({ data: {} });

    await api.login('ada@utn.edu', 'secreta');

    const [url, config] = globalThis.fetch.mock.calls[0];
    expect(url).toBe(`${BASE}/api/portal/auth/login`);
    expect(config.method).toBe('POST');
    expect(JSON.parse(config.body)).toEqual({ email: 'ada@utn.edu', password: 'secreta' });
  });

  it('publicVerify: codifica el hash en la URL', async () => {
    mockFetchOnce({ data: { valid: true } });

    await api.publicVerify('0x12/34');

    const [url] = globalThis.fetch.mock.calls[0];
    expect(url).toBe(`${BASE}/api/public/verify/0x12%2F34`);
  });

  it('revokeCredential: POST con credential_hash y reason', async () => {
    api.setToken('TKN');
    mockFetchOnce({ data: { ok: true } });

    await api.revokeCredential('hash123', 'fraude');

    const [url, config] = globalThis.fetch.mock.calls[0];
    expect(url).toBe(`${BASE}/api/admin/credentials/revoke`);
    expect(config.method).toBe('POST');
    expect(JSON.parse(config.body)).toEqual({ credential_hash: 'hash123', reason: 'fraude' });
  });

  it('toggleVisibility: PATCH con el cuerpo esperado', async () => {
    api.setToken('TKN');
    mockFetchOnce({ data: { ok: true } });

    await api.toggleVisibility('hashABC', true);

    const [url, config] = globalThis.fetch.mock.calls[0];
    expect(url).toBe(`${BASE}/api/portal/credentials/visibility`);
    expect(config.method).toBe('PATCH');
    expect(JSON.parse(config.body)).toEqual({ credential_hash: 'hashABC', is_public: true });
  });
});
