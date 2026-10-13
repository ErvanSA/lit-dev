import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecBadge } from './wec-badge.js';
import './wec-badge.js';

type MetaWithDocs<T> = Meta<T> & { docs?: { page?: string } };

const meta: MetaWithDocs<WecBadge> = {
  title: 'Atoms/wec-badge',
  component: 'wec-badge',
  tags: ['autodocs'],
  docs: {
    page: './wec-badge.mdx',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'brand', 'success', 'warning', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<WecBadge>;

export const Playground: Story = {
  args: {
    variant: 'brand',
  },
  render: (args) => html`<wec-badge variant=${args.variant}>Status</wec-badge>`,
};
