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
  parameters: {
    docs: {
      description: {
        component:
          'Tombol dasar wec-ui. Varian: `primary`, `secondary`, `ghost`, `danger`. ' +
          'Gunakan Playground untuk mencoba semua state.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    click: { action: 'click' },
  },
};

export default meta;
type Story = StoryObj<WecButton>;

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
  },
  render: (args) => html`
    <wec-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      Klik saya
    </wec-button>
  `,
};
