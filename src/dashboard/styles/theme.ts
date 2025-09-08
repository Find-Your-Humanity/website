import { createTheme } from '@mui/material/styles';

function readCssVar(name: string, fallback: string): string {
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return value || fallback;
  } catch {
    return fallback;
  }
}

function getMode(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';
  const mode = document.documentElement.getAttribute('data-theme');
  return mode === 'dark' ? 'dark' : 'light';
}

export function buildThemeFromCssVars() {
  const mode = getMode();
  const palette = {
    mode,
    primary: { main: readCssVar('--accent-color', '#DFFF00') },
    secondary: { main: readCssVar('--text-secondary', '#666666') },
    background: {
      default: readCssVar('--bg-secondary', mode === 'dark' ? '#1a2332' : '#f8f9fa'),
      paper: readCssVar('--bg-primary', mode === 'dark' ? '#0a0f1a' : '#ffffff'),
    },
    text: {
      primary: readCssVar('--text-primary', mode === 'dark' ? '#f8fafc' : '#000000'),
      secondary: readCssVar('--text-secondary', mode === 'dark' ? '#cbd5e1' : '#666666'),
    },
    error: { main: readCssVar('--error-color', '#dc3545') },
    success: { main: readCssVar('--success-color', '#28a745') },
    warning: { main: readCssVar('--warning-color', '#ffc107') },
  } as const;

  return createTheme({
    palette: palette as any,
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 2px 10px var(--shadow-color)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });
}

const theme = buildThemeFromCssVars();
export default theme;
