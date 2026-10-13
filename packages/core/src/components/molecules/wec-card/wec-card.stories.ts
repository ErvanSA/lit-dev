import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecCard } from './wec-card.js';
import './wec-card.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecCard> = {
  title: 'Molecules/wec-card',
  component: 'wec-card',
  tags: ['autodocs'],
  docs: {
    page: './wec-card.mdx',
  },
  argTypes: {
    click: { action: 'click' },
  },
};

export default meta;
type Story = StoryObj<WecCard>;

export const Playground: Story = {
  args: {
    interactive: false,
  },
  render: (args) => html`
    <div style="max-width: 360px">
      <wec-card ?interactive=${args.interactive}>
        <h3 slot="header">Judul Kartu</h3>
        <p style="margin: 0; font-family: var(--wec-font-family-base)">
          Isi kartu. Slot default menerima konten apa pun.
        </p>
        <div slot="footer">
          <wec-button size="sm" variant="secondary">Batal</wec-button>
          <wec-button size="sm">Simpan</wec-button>
        </div>
      </wec-card>
    </div>
  `,
};
