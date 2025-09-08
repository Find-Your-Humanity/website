import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

type GuardProps = { children: React.ReactElement };

export const RequireAuth: React.FC<GuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">인증 확인 중...</Typography>
      </Box>
    );
  }

  const isAuthenticated = !!user;
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
};

export const RequireAdmin: React.FC<GuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="textSecondary">관리자 권한 확인 중...</Typography>
      </Box>
    );
  }

  const isAuthenticated = !!user;
  const isAdmin = !!user && (user.is_admin === true || user.is_admin === 1 || user.role === 'admin');

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  if (!isAdmin) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="60vh" gap={2}>
        <Typography variant="h6" color="error">접근 권한이 없습니다</Typography>
        <Typography variant="body2" color="textSecondary">관리자만 접근할 수 있는 페이지입니다.</Typography>
      </Box>
    );
  }
  return children;
};
