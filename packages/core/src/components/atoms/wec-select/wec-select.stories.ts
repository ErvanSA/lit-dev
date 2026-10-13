import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecSelect } from './wec-select.js';
import './wec-select.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecSelect> = {
  title: 'Atoms/wec-select',
  component: 'wec-select',
  tags: ['autodocs'],
  docs: {
    page: './wec-select.mdx',
  },
  argTypes: {
    'wec-change': { action: 'wec-change' },
    'wec-focus': { action: 'wec-focus' },
    'wec-blur': { action: 'wec-blur' },
  },
};

export default meta;
type Story = StoryObj<WecSelect>;

export const Playground: Story = {
  args: {
    value: '',
    placeholder: 'Pilih kota',
    disabled: false,
    required: true,
    invalid: false,
  },
  render: (args) => html`
    <div style="max-width: 320px">
      <wec-select
        .value=${args.value}
        placeholder=${args.placeholder}
        ?disabled=${args.disabled}
        ?required=${args.required}
        ?invalid=${args.invalid}
      >
        <option value="bdg">Bandung</option>
        <option value="jkt">Jakarta</option>
        <option value="sby">Surabaya</option>
      </wec-select>
    </div>
  `,
};
