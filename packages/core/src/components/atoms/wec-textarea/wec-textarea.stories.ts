import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecTextarea } from './wec-textarea.js';
import './wec-textarea.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecTextarea> = {
  title: 'Atoms/wec-textarea',
  component: 'wec-textarea',
  tags: ['autodocs'],
  docs: {
    page: './wec-textarea.mdx',
  },
  argTypes: {
    'wec-input': { action: 'wec-input' },
    'wec-change': { action: 'wec-change' },
    'wec-focus': { action: 'wec-focus' },
    'wec-blur': { action: 'wec-blur' },
  },
};

export default meta;
type Story = StoryObj<WecTextarea>;

export const Playground: Story = {
  args: {
    value: '',
    placeholder: 'Tulis catatan…',
    rows: 4,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
  },
  render: (args) => html`
    <div style="max-width: 420px">
      <wec-textarea
        .value=${args.value}
        placeholder=${args.placeholder}
        rows=${args.rows}
        ?disabled=${args.disabled}
        ?readonly=${args.readonly}
        ?required=${args.required}
        ?invalid=${args.invalid}
      ></wec-textarea>
    </div>
  `,
};
