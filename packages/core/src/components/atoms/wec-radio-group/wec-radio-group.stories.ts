import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecRadioGroup } from './wec-radio-group.js';
import './wec-radio-group.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecRadioGroup> = {
  title: 'Atoms/wec-radio-group',
  component: 'wec-radio-group',
  tags: ['autodocs'],
  docs: {
    page: './wec-radio-group.mdx',
  },
  argTypes: {
    'wec-change': { action: 'wec-change' },
  },
};

export default meta;
type Story = StoryObj<WecRadioGroup>;

export const Playground: Story = {
  args: {
    disabled: false,
  },
  render: (args) => html`
    <wec-radio-group ?disabled=${args.disabled} value="reguler">
      <label style="display: grid; gap: 4px; font-family: var(--wec-font-family-base)">
        <input type="radio" name="paket-story" value="reguler" />
        Reguler
      </label>
      <label style="display: grid; gap: 4px; font-family: var(--wec-font-family-base)">
        <input type="radio" name="paket-story" value="ekspres" />
        Ekspres
      </label>
      <label style="display: grid; gap: 4px; font-family: var(--wec-font-family-base)">
        <input type="radio" name="paket-story" value="same-day" />
        Same day
      </label>
    </wec-radio-group>
  `,
};
