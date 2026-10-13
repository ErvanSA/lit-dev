import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecFormField } from './wec-form-field.js';
import './wec-form-field.js';
import '../../atoms/wec-input/wec-input.js';

type MetaWithDocs<T> = Omit<Meta<T>, 'argTypes'> & {
  docs?: { page?: string };
  /** argTypes longgar: props komponen + nama event untuk addon-actions. */
  argTypes?: Record<string, Record<string, unknown>>;
};

const meta: MetaWithDocs<WecFormField> = {
  title: 'Molecules/wec-form-field',
  component: 'wec-form-field',
  tags: ['autodocs'],
  docs: {
    page: './wec-form-field.mdx',
  },
};

export default meta;
type Story = StoryObj<WecFormField>;

export const Playground: Story = {
  args: {
    label: 'Email',
    hint: 'Gunakan email kantor Anda',
    error: '',
    required: true,
  },
  render: (args) => html`
    <div style="max-width: 320px">
      <wec-form-field
        label=${args.label}
        hint=${args.hint}
        error=${args.error}
        ?required=${args.required}
      >
        <wec-input type="email" placeholder="nama@perusahaan.co.id"></wec-input>
      </wec-form-field>
    </div>
  `,
};
