import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../Skeleton';

const meta = {
  title: 'Shared/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'w-48 h-10',
  },
};
