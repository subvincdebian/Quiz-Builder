import { render, screen } from '@testing-library/react';
import { Button } from '../Button';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
