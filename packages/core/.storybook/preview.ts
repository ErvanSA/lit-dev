import type { Preview } from '@storybook/web-components-vite';
import '../../../tokens/build/tokens.css';
import '../../../tokens/build/fonts.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
