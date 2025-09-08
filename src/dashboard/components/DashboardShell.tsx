import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../styles/theme';
import Layout from './layout/Layout';

interface Props {
  children: React.ReactNode;
}

// Dashboard shell that applies local theme and wraps the original Layout (1:1 UI)
const DashboardShell: React.FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        {children}
      </Layout>
    </ThemeProvider>
  );
};

export default DashboardShell;
