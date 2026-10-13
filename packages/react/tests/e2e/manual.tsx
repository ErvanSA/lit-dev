import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from '../../src/index.js';

function App() {
  return (
    <Button variant="danger" id="manual-btn">
      Klik
    </Button>
  );
}

const container = document.getElementById('root')!;
createRoot(container).render(<App />);
