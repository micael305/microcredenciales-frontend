import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CredentialCard from './CredentialCard.jsx';

describe('CredentialCard', () => {
  it('muestra el curso, el emisor y la fecha de emisión', () => {
    render(<CredentialCard title="Curso de Blockchain" issuer="UTN" issueDate="10/06/2026" />);

    expect(screen.getByText('Curso de Blockchain')).toBeInTheDocument();
    expect(screen.getByText('UTN')).toBeInTheDocument();
    expect(screen.getByText(/10\/06\/2026/)).toBeInTheDocument();
  });

  it('muestra el badge de estado por defecto "Emitida"', () => {
    render(<CredentialCard title="X" issuer="UTN" issueDate="—" />);
    expect(screen.getByText('Emitida')).toBeInTheDocument();
  });

  it('refleja el estado recibido por props (Pendiente)', () => {
    render(<CredentialCard title="X" issuer="UTN" issueDate="—" status="Pendiente" />);
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('llama a onViewDetails al hacer click en "Ver Detalles"', async () => {
    const onViewDetails = vi.fn();
    render(<CredentialCard title="X" issuer="UTN" issueDate="—" onViewDetails={onViewDetails} />);

    await userEvent.click(screen.getByText('Ver Detalles'));
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it('llama a onShare al hacer click en el botón de compartir', async () => {
    const onShare = vi.fn();
    render(<CredentialCard title="X" issuer="UTN" issueDate="—" onShare={onShare} />);

    await userEvent.click(screen.getByLabelText('Compartir credencial'));
    expect(onShare).toHaveBeenCalledTimes(1);
  });
});
