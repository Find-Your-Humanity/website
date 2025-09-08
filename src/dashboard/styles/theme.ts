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
  // 대시보드 기본 팔레트(고정값). 필요 시 --dashboard-primary/secondary로만 오버라이드
  const primaryMain = readCssVar('--dashboard-primary', '#1976d2');
  const secondaryMain = readCssVar('--dashboard-secondary', '#dc004e');
  const palette = {
    mode,
    primary: { main: primaryMain },
    secondary: { main: secondaryMain },
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
  });
}

const theme = buildThemeFromCssVars();
export default theme;
