import { useState } from 'react';
import {
  getActiveTheme,
  toggleTheme,
  type ThemeMode,
} from '../../services/themeService';
import { MoonIcon, SunIcon } from '../icons/AppIcons';

type ThemeToggleButtonProps = {
  className?: string;
};

function ThemeToggleButton({ className = '' }: ThemeToggleButtonProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => getActiveTheme());

  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const nextLabel = nextTheme === 'light' ? 'Modo claro' : 'Modo oscuro';

  const handleToggle = () => {
    setTheme(toggleTheme());
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      onClick={handleToggle}
      aria-label={`Cambiar a ${nextLabel.toLowerCase()}`}
      title={nextLabel}
    >
      {nextTheme === 'light' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
      <span>{nextLabel}</span>
    </button>
  );
}

export default ThemeToggleButton;
