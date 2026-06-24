import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import ShareModal from './ShareModal.jsx';

/**
 * El ShareModal es el punto único de "compartir a la comunidad" del portal:
 * arma el enlace de verificación pública (/verificar/{hash}), el QR y el
 * deep-link de LinkedIn. Verificamos esos contratos y la coherencia con la
 * política de privacidad (avisar si la credencial es privada).
 */

beforeEach(() => {
  vi.restoreAllMocks();
});

const baseCred = {
  credential_hash: 'abc123',
  course_name: 'Curso de Blockchain',
  issuer: 'UTN',
  completion_date: '2026-06-10T12:00:00+00:00',
  is_public: true,
};

describe('ShareModal', () => {
  it('no renderiza nada sin credencial', () => {
    const { container } = render(<ShareModal credential={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('arma el enlace de verificación pública con el hash', () => {
    render(<ShareModal credential={baseCred} onClose={() => {}} />);
    const input = screen.getByDisplayValue(`${window.location.origin}/verificar/abc123`);
    expect(input).toBeInTheDocument();
  });

  it('ofrece el deep-link "Add to Profile" de LinkedIn apuntando a la verificación', () => {
    render(<ShareModal credential={baseCred} onClose={() => {}} />);
    const link = screen.getByRole('link', { name: /LinkedIn/i });
    const href = link.getAttribute('href');
    expect(href).toContain('https://www.linkedin.com/profile/add?');
    expect(href).toContain('startTask=CERTIFICATION_NAME');
    expect(href).toContain(`certUrl=${encodeURIComponent(`${window.location.origin}/verificar/abc123`)}`);
    expect(href).toContain('certId=abc123');
  });

  it('avisa cuando la credencial es privada', () => {
    render(<ShareModal credential={{ ...baseCred, is_public: false }} onClose={() => {}} />);
    expect(screen.getByText(/no verá tus datos/i)).toBeInTheDocument();
  });

  it('no muestra el aviso de privacidad cuando es pública', () => {
    render(<ShareModal credential={baseCred} onClose={() => {}} />);
    expect(screen.queryByText(/no verá tus datos/i)).not.toBeInTheDocument();
  });
});
