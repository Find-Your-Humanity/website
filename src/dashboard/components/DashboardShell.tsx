import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { buildThemeFromCssVars } from '../styles/theme';
import Layout from './layout/Layout';

interface Props {
  children: React.ReactNode;
}

// Dashboard shell that applies local theme and wraps the original Layout (1:1 UI)
const DashboardShell: React.FC<Props> = ({ children }) => {
  // 현재 data-theme 기반으로 초기 테마 생성
  const [muiTheme, setMuiTheme] = React.useState(buildThemeFromCssVars());
  
  // 테마 변수 변경 시 재생성
  React.useEffect(() => {
    const apply = () => setMuiTheme(buildThemeFromCssVars());
    
    // 진입 시 1회 보정(라우팅으로 들어온 경우 다크 그대로 적용)
    apply();
    
    // data-theme 속성 변경 감지하여 테마 업데이트
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Layout>
        {children}
      </Layout>
    </ThemeProvider>
  );
};

export default DashboardShell;
