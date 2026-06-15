export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'geta-theme';
const DEFAULT_THEME: ThemeMode = 'dark';

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === 'dark' || value === 'light';
}

function applyThemeToDocument(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
}

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeMode(storedTheme) ? storedTheme : null;
}

export function getActiveTheme(): ThemeMode {
  if (typeof document !== 'undefined') {
    const currentTheme = document.documentElement.dataset.theme;

    if (isThemeMode(currentTheme)) {
      return currentTheme;
    }
  }

  return getStoredTheme() || DEFAULT_THEME;
}

export function setTheme(theme: ThemeMode): ThemeMode {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  if (typeof document !== 'undefined') {
    applyThemeToDocument(theme);
  }

  return theme;
}

export function toggleTheme(): ThemeMode {
  return setTheme(getActiveTheme() === 'dark' ? 'light' : 'dark');
}

export function initializeTheme(): ThemeMode {
  const theme = getStoredTheme() || DEFAULT_THEME;

  if (typeof document !== 'undefined') {
    applyThemeToDocument(theme);
  }

  return theme;
}
