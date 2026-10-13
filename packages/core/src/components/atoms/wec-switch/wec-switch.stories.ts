import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecSwitch } from './wec-switch.js';
import './wec-switch.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecSwitch> = {
  title: 'Atoms/wec-switch',
  component: 'wec-switch',
  tags: ['autodocs'],
  docs: {
    page: './wec-switch.mdx',
  },
  argTypes: {
    'wec-change': { action: 'wec-change' },
  },
};

export default meta;
type Story = StoryObj<WecSwitch>;

export const Playground: Story = {
  args: {
    checked: true,
    disabled: false,
    invalid: false,
  },
  render: (args) => html`
    <wec-switch ?checked=${args.checked} ?disabled=${args.disabled} ?invalid=${args.invalid}>
      Notifikasi email
    </wec-switch>
  `,
};
