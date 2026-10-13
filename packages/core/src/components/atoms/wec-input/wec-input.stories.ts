import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecInput } from './wec-input.js';
import './wec-input.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecInput> = {
  title: 'Atoms/wec-input',
  component: 'wec-input',
  tags: ['autodocs'],
  docs: {
    page: './wec-input.mdx',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    'wec-input': { action: 'wec-input' },
    'wec-change': { action: 'wec-change' },
    'wec-focus': { action: 'wec-focus' },
    'wec-blur': { action: 'wec-blur' },
  },
};

export default meta;
type Story = StoryObj<WecInput>;

export const Playground: Story = {
  args: {
    type: 'text',
    value: '',
    placeholder: 'Masukkan teks…',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
  },
  render: (args) => html`
    <div style="max-width: 320px">
      <wec-input
        type=${args.type}
        .value=${args.value}
        placeholder=${args.placeholder}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?required=${args.required}
        ?invalid=${args.invalid}
      ></wec-input>
    </div>
  `,
};
