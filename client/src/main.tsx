import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/global.css';
import { initializeTheme } from './services/themeService';

initializeTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App></App>
  </StrictMode>,
);
