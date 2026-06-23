import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import VerificacionPublica from './VerificacionPublica.jsx';
import * as api from '../../api/client';

// Simulamos la API y aislamos la página de los layouts (Header/Footer usan auth/router).
vi.mock('../../api/client');
vi.mock('../../components/Header/Header', () => ({ default: () => null }));
vi.mock('../../components/Footer/Footer', () => ({ default: () => null }));

function renderConHash(hash) {
  return render(
    <MemoryRouter initialEntries={[`/verificar/${hash}`]}>
      <Routes>
        <Route path="/verificar/:hash" element={<VerificacionPublica />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('VerificacionPublica', () => {
  it('verifica automáticamente el hash de la URL y muestra la credencial válida', async () => {
    api.publicVerify.mockResolvedValue({
      valid: true,
      verdict: 'valid',
      credential_hash: 'abc123',
      student_name: 'Ada Lovelace',
      course_name: 'Curso de Blockchain',
      completion_date: '2026-06-10T12:00:00+00:00',
      issuer: 'UTN',
      blockchain: { status: 'anchored', network: 'Besu Net' },
    });

    renderConHash('abc123');

    await waitFor(() => expect(screen.getByText('Credencial Válida')).toBeInTheDocument());
    expect(api.publicVerify).toHaveBeenCalledWith('abc123');
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('Curso de Blockchain')).toBeInTheDocument();
  });

  it('muestra "Credencial Revocada" cuando el veredicto es revoked', async () => {
    api.publicVerify.mockResolvedValue({
      valid: false,
      verdict: 'revoked',
      credential_hash: 'abc123',
      course_name: 'Curso de Blockchain',
      revoked_at: '2026-06-20T10:00:00+00:00',
      blockchain: { status: 'revoked', network: 'Besu Net' },
    });

    renderConHash('abc123');

    await waitFor(() => expect(screen.getByText('Credencial Revocada')).toBeInTheDocument());
    // Aunque no sea válida, sí se reconoce su existencia y se muestra el curso.
    expect(screen.getByText('Curso de Blockchain')).toBeInTheDocument();
  });

  it('muestra la evidencia blockchain con el estado correcto', async () => {
    api.publicVerify.mockResolvedValue({
      valid: true,
      credential_hash: 'abc123',
      course_name: 'C',
      blockchain: { status: 'anchored', network: 'Besu Net', explorer_url: 'https://exp/tx/1' },
    });

    renderConHash('abc123');

    // La etiqueta proviene del helper real getBlockchainStatusLabel('anchored').
    await waitFor(() =>
      expect(screen.getByText('Verificada en Blockchain')).toBeInTheDocument()
    );
  });

  it('muestra "Credencial No Encontrada" cuando el hash no es válido', async () => {
    api.publicVerify.mockResolvedValue({ valid: false, credential_hash: 'xyz' });

    renderConHash('xyz');

    await waitFor(() =>
      expect(screen.getByText('Credencial No Encontrada')).toBeInTheDocument()
    );
  });

  it('muestra un mensaje de error si la verificación falla', async () => {
    api.publicVerify.mockRejectedValue(new Error('Error de red'));

    renderConHash('zzz');

    await waitFor(() => expect(screen.getByText('Error de red')).toBeInTheDocument());
  });

  it('renderiza el formulario de búsqueda por hash', async () => {
    api.publicVerify.mockResolvedValue({ valid: false, credential_hash: 'q' });

    renderConHash('q');

    expect(screen.getByPlaceholderText(/Pegar hash/i)).toBeInTheDocument();
  });
});
