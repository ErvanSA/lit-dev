import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import type { WecCheckbox } from './wec-checkbox.js';
import './wec-checkbox.js';

type MetaWithDocs<T> = Meta<T> & { docs?: { page?: string } };

const meta: MetaWithDocs<WecCheckbox> = {
  title: 'Atoms/wec-checkbox',
  component: 'wec-checkbox',
  tags: ['autodocs'],
  docs: {
    page: './wec-checkbox.mdx',
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
