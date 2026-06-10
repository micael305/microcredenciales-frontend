import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute.jsx';
import { useAuth } from '../../context/AuthContext';

// El guard depende del contexto de auth: lo controlamos por test.
vi.mock('../../context/AuthContext');

function renderGuarded(path = '/privado') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>Pantalla de login</div>} />
        <Route path="/configurar-password" element={<div>Configurar contraseña</div>} />
        <Route
          path="/privado"
          element={
            <ProtectedRoute>
              <div>contenido privado</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('ProtectedRoute', () => {
  it('muestra "Cargando..." mientras se resuelve la sesión', () => {
    useAuth.mockReturnValue({ user: null, loading: true });
    renderGuarded();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('redirige al login si no hay usuario autenticado', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    renderGuarded();
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
    expect(screen.queryByText('contenido privado')).not.toBeInTheDocument();
  });

  it('redirige a configurar contraseña si el usuario no tiene una', () => {
    useAuth.mockReturnValue({ user: { has_password: false }, loading: false });
    renderGuarded();
    expect(screen.getByText('Configurar contraseña')).toBeInTheDocument();
  });

  it('renderiza el contenido si el usuario está autenticado y tiene contraseña', () => {
    useAuth.mockReturnValue({ user: { has_password: true }, loading: false });
    renderGuarded();
    expect(screen.getByText('contenido privado')).toBeInTheDocument();
  });
});
