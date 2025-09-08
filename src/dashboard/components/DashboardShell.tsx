import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme, { buildThemeFromCssVars } from '../styles/theme';
import Layout from './layout/Layout';

interface Props {
  children: React.ReactNode;
}

// Dashboard shell that applies local theme and wraps the original Layout (1:1 UI)
const DashboardShell: React.FC<Props> = ({ children }) => {
  // 테마 변수 변경 시 강제 재생성(간단한 키)
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    const observer = new MutationObserver(() => setKey((k) => k + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={key ? buildThemeFromCssVars() : theme}>
      <CssBaseline />
      <Layout>
        {children}
      </Layout>
    </ThemeProvider>
  );
};

export default DashboardShell;
