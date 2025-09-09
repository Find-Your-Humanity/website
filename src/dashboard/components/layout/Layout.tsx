import React, { useState } from 'react';
import {
  Box,
  Drawer,
  SwipeableDrawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 250;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const SWIPE_AREA = 24; // px, keep in sync with --rc-drawer-swipe-area

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 모바일에서 좌측 피크(힌트) 영역 - 스와이프/탭으로 열기 */}
      {isMobile && (
        <Box
          className={`rc-sidebar-peek ${mobileOpen ? 'active' : ''}`}
          onClick={handleDrawerToggle}
          role="button"
          aria-label="메뉴 열기"
        />
      )}
      {/* 사이드바 */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* 모바일용 드로어 - 스와이프 지원 */}
        <SwipeableDrawer
          disableBackdropTransition={false}
          keepMounted
          open={mobileOpen}
          onOpen={() => setMobileOpen(true)}
          onClose={() => setMobileOpen(false)}
          anchor="left"
          swipeAreaWidth={SWIPE_AREA}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              borderRight: '1px solid var(--border-color)',
              opacity: 1, // 완전 불투명
              backdropFilter: 'none', // 블러 효과 제거
            },
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 어둡게
            },
          }}
        >
          <Sidebar onItemClick={() => setMobileOpen(false)} />
        </SwipeableDrawer>
        {/* 데스크톱용 드로어 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              borderRight: '1px solid var(--border-color)',
              opacity: 1, // 완전 불투명
              backdropFilter: 'none', // 블러 효과 제거
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* 메인 컨텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
