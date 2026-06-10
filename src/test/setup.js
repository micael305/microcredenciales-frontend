// Configuración global de los tests (Vitest + Testing Library).
// - Registra los matchers de jest-dom (toBeInTheDocument, toHaveTextContent, ...).
// - Limpia el DOM renderizado después de cada test (buena práctica de QA).
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
