import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll, vi, expect } from 'vitest';
import { server } from './server';
import { configureAxe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../public/locales/en/translation.json';

// Extend Vitest expect with axe matchers
expect.extend(matchers);

// Configure axe-core
configureAxe({
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'best-practice'],
  },
});

beforeAll(async () => {
  await i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: 'translation',
    resources: { en: { translation: en } },
    interpolation: { escapeValue: false },
  });
  server.listen();
});
afterEach(() => {
  cleanup();
  server.resetHandlers();
});
afterAll(() => server.close());

// Mocking some globals if necessary
vi.stubGlobal(
  'matchMedia',
  vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
);
