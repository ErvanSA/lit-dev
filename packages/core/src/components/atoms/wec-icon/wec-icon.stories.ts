import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecIcon } from './wec-icon.js';
import './wec-icon.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecIcon> = {
  title: 'Atoms/wec-icon',
  component: 'wec-icon',
  tags: ['autodocs'],
  docs: {
    page: './wec-icon.mdx',
  },
  argTypes: {
    name: { control: 'select', options: ['check', 'close'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<WecIcon>;

export const Playground: Story = {
  args: {
    name: 'check',
    size: 'md',
    label: '',
  },
  render: (args) =>
    html`<wec-icon name=${args.name} size=${args.size} label=${args.label}></wec-icon>`,
};
