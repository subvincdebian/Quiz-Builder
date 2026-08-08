import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from '../RadioGroup';
import { fn } from '@storybook/test';

const meta = {
  title: 'Shared/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Select an option',
    options: [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
    ],
    value: '1',
  },
};
