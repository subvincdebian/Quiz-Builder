import { render, screen, fireEvent } from '@testing-library/react';
import { RadioGroup } from '../RadioGroup';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';

describe('RadioGroup', () => {
  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ];

  it('renders correctly', () => {
    render(
      <RadioGroup
        options={options}
        value="opt1"
        onChange={vi.fn()}
        label="Test"
      />
    );
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('calls onChange when option is clicked', () => {
    const onChange = vi.fn();
    render(<RadioGroup options={options} value="opt1" onChange={onChange} />);
    fireEvent.click(screen.getByText('Option 2'));
    expect(onChange).toHaveBeenCalledWith('opt2');
  });

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <RadioGroup
        options={options}
        value="opt1"
        onChange={vi.fn()}
        label="Test"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
