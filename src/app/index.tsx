import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const container = document.getElementById('app-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}