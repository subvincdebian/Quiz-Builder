import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '../Select';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { axe } from 'vitest-axe';

describe('Select', () => {
  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ];

  it('renders correctly', () => {
    render(<Select options={options} label="Test Select" />);
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(<Select options={options} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'opt2' },
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(<Select options={options} label="Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
