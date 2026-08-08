import { render, screen } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { vi, describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('LanguageSwitcher', () => {
  it('renders correctly', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('combobox')).toBeDefined();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<LanguageSwitcher />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
