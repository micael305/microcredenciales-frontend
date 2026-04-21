const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const TOKEN_KEY = 'portal_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, { method = 'GET', body, skipAuth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);

  if (response.status === 401) {
    clearToken();
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || `Error ${response.status}`);
  }

  return response.json();
}

// --- Auth ---

export async function login(email, password) {
  return request('/api/portal/auth/login', {
    method: 'POST',
    body: { email, password },
    skipAuth: true,
  });
}

export async function moodleCallback(token) {
  return request('/api/portal/auth/moodle-callback', {
    method: 'POST',
    body: { token },
    skipAuth: true,
  });
}

export async function getMe() {
  return request('/api/portal/auth/me');
}

export async function setPassword(password) {
  return request('/api/portal/auth/set-password', {
    method: 'POST',
    body: { password },
  });
}

// --- Credentials ---

export async function getCredentials() {
  return request('/api/portal/credentials');
}

export async function getCredentialDetail(id) {
  return request(`/api/portal/credentials/${id}`);
}

export async function verifyCredential(id) {
  return request(`/api/portal/credentials/${id}/verify`);
}

// --- Stats ---

export async function getStats() {
  return request('/api/portal/stats');
}

// --- Public verification ---

export async function publicVerify(hash) {
  return request(`/api/public/verify/${encodeURIComponent(hash)}`, { skipAuth: true });
}

// --- Credential Visibility ---

export async function toggleVisibility(credentialHash, isPublic) {
  return request('/api/portal/credentials/visibility', {
    method: 'PATCH',
    body: { credential_hash: credentialHash, is_public: isPublic },
  });
}
