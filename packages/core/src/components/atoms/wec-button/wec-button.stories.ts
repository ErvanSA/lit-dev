import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecButton } from './wec-button.js';
import './wec-button.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecButton> = {
  title: 'Atoms/wec-button',
  component: 'wec-button',
  tags: ['autodocs'],
  docs: {
    page: './wec-button.mdx',
  },
  argTypes: {
    variant: { control: 'radio', options: ['primary', 'outline'] },
    click: { action: 'click' },
  },
};

export default meta;
type Story = StoryObj<WecButton>;

export const Playground: Story = {
  args: {
    variant: 'primary',
    disabled: true,
  },
  render: (args) => html`
    <wec-button variant=${args.variant} ?disabled=${args.disabled}>Ganti Nomor</wec-button>
  `,
};
