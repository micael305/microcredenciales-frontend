import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthProvider, useAuth } from './AuthContext.jsx';
import * as api from '../api/client';

// El contexto habla con el backend a través del cliente: lo simulamos.
vi.mock('../api/client');

function Consumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'anon'}</span>
      <button onClick={() => login('ada@utn.edu', 'secreta')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('AuthContext', () => {
  it('arranca sin usuario cuando no hay token guardado', async () => {
    api.getToken.mockReturnValue(null);

    render(<AuthProvider><Consumer /></AuthProvider>);

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('anon'));
    expect(api.getMe).not.toHaveBeenCalled();
  });

  it('login guarda el token y setea el usuario', async () => {
    api.getToken.mockReturnValue(null);
    api.login.mockResolvedValue({
      access_token: 'TKN',
      student: { email: 'ada@utn.edu' },
    });

    render(<AuthProvider><Consumer /></AuthProvider>);
    await userEvent.click(screen.getByText('login'));

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('ada@utn.edu'));
    expect(api.setToken).toHaveBeenCalledWith('TKN');
  });

  it('logout limpia el token y el usuario', async () => {
    api.getToken.mockReturnValue('TKN');
    api.getMe.mockResolvedValue({ email: 'ada@utn.edu' });

    render(<AuthProvider><Consumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('ada@utn.edu'));

    await userEvent.click(screen.getByText('logout'));

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('anon'));
    expect(api.clearToken).toHaveBeenCalled();
  });
});
