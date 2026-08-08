import { render, screen } from '@testing-library/react';
import { Input } from '../Input';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { axe } from 'vitest-axe';

describe('Input', () => {
  it('renders label correctly', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders error message correctly', () => {
    render(<Input error="Test Error" />);
    expect(screen.getByText('Test Error')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<Input label="Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
