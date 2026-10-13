import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecCheckbox } from './wec-checkbox.js';
import './wec-checkbox.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecCheckbox> = {
  title: 'Atoms/wec-checkbox',
  component: 'wec-checkbox',
  tags: ['autodocs'],
  docs: {
    page: './wec-checkbox.mdx',
  },
  argTypes: {
    'wec-change': { action: 'wec-change' },
  },
};

export default meta;
type Story = StoryObj<WecCheckbox>;

export const Playground: Story = {
  args: {
    checked: false,
    disabled: false,
    invalid: false,
  },
  render: (args) => html`
    <wec-checkbox ?checked=${args.checked} ?disabled=${args.disabled} ?invalid=${args.invalid}>
      Setuju dengan syarat dan ketentuan
    </wec-checkbox>
  `,
};
