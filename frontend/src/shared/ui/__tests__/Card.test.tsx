import { render, screen } from '@testing-library/react';
import { Card } from '../Card';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<Card>Content</Card>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
