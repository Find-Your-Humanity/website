import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const ApiKeysScreen: React.FC = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>API 키</Typography>
    <Paper sx={{ p: 2 }}>API 키 발급/토글/삭제 등의 기능을 제공합니다.</Paper>
  </Box>
);

export const UsersScreen: React.FC = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>사용자 관리</Typography>
    <Paper sx={{ p: 2 }}>사용자 목록, 권한, 상태 등을 관리합니다.</Paper>
  </Box>
);

export const PlansScreen: React.FC = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>요금제 관리</Typography>
    <Paper sx={{ p: 2 }}>플랜 정의, 가격, 권한 등을 관리합니다.</Paper>
  </Box>
);

export const RequestsScreen: React.FC = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>요청사항</Typography>
    <Paper sx={{ p: 2 }}>사용자 요청/문의 관리 화면입니다.</Paper>
  </Box>
);

export const RequestStatusScreen: React.FC = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>요청 상태</Typography>
    <Paper sx={{ p: 2 }}>요청 처리 상태를 모니터링합니다.</Paper>
  </Box>
);

export const SettingsScreen: React.FC = () => (
  <Box>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>설정</Typography>
    <Paper sx={{ p: 2 }}>계정 및 서비스 관련 설정을 구성합니다.</Paper>
  </Box>
);
