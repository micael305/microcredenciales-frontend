import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import ShareModal from './ShareModal.jsx';

/**
 * El ShareModal es el punto único de "compartir a la comunidad" del portal:
 * arma el enlace de verificación pública (/verificar/{hash}), el QR, el
 * deep-link de LinkedIn (Add to Profile), el "Publicar" (Open Graph) y los
 * datos copiables. Verificamos esos contratos y la política de privacidad.
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
    expect(
      screen.getByDisplayValue(`${window.location.origin}/verificar/abc123`)
    ).toBeInTheDocument();
  });

  it('ofrece "Agregar a mi perfil" (Add to Profile) apuntando a la verificación', () => {
    render(<ShareModal credential={baseCred} onClose={() => {}} />);
    const link = screen.getByRole('link', { name: /Agregar a mi perfil/i });
    const href = link.getAttribute('href');
    expect(href).toContain('https://www.linkedin.com/profile/add?');
    expect(href).toContain('startTask=CERTIFICATION_NAME');
    expect(href).toContain(`certUrl=${encodeURIComponent(`${window.location.origin}/verificar/abc123`)}`);
    expect(href).toContain('certId=abc123');
  });

  it('ofrece "Publicar" como share-offsite hacia la página Open Graph', () => {
    render(<ShareModal credential={baseCred} onClose={() => {}} />);
    const link = screen.getByRole('link', { name: /Publicar/i });
    const href = link.getAttribute('href');
    expect(href).toContain('https://www.linkedin.com/sharing/share-offsite/?url=');
    // Apunta a la página embed (OG) que arma la tarjeta rica.
    expect(decodeURIComponent(href)).toContain('/api/public/verify/abc123/embed');
  });

  it('muestra los datos copiables para el formulario de LinkedIn', () => {
    render(<ShareModal credential={baseCred} onClose={() => {}} />);
    expect(screen.getByText('Nombre de la certificación')).toBeInTheDocument();
    expect(screen.getByText('ID de la credencial')).toBeInTheDocument();
    // El valor del curso aparece (en el campo copiable).
    expect(screen.getAllByText('Curso de Blockchain').length).toBeGreaterThan(0);
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
