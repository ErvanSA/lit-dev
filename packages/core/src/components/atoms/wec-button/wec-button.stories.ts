import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecButton } from './wec-button.js';
import './wec-button.js';

const meta: Meta<WecButton> = {
  title: 'Atoms/wec-button',
  component: 'wec-button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tombol dasar wec-ui. Versi Fase 0 sebagai validator pipeline — dokumentasi lengkap ' +
          '(contoh React/Angular/Next/Drupal) menyusul di Fase 1 sesuai Definition of Done.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<WecButton>;

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
  render: (args) => html`
    <wec-button variant=${args.variant} size=${args.size} ?disabled=${args.disabled}>
      Klik saya
    </wec-button>
  `,
};

export const SemuaVarian: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
      <wec-button variant="primary">Primary</wec-button>
      <wec-button variant="secondary">Secondary</wec-button>
      <wec-button variant="ghost">Ghost</wec-button>
      <wec-button variant="danger">Danger</wec-button>
      <wec-button variant="primary" disabled>Disabled</wec-button>
    </div>
  `,
};

export const SemuaUkuran: Story = {
  render: () => html`
    <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
      <wec-button size="sm">Small</wec-button>
      <wec-button size="md">Medium</wec-button>
      <wec-button size="lg">Large</wec-button>
    </div>
  `,
};
