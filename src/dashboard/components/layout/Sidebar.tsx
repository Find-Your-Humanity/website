import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Email as EmailIcon,
  Timeline as TimelineIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

interface SidebarProps {
  onItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();

  const isUserAdmin = !!user && (user.is_admin === true || (user as any).is_admin === 1 || user.role === 'admin');
  const base = isUserAdmin ? '/admin' : '/app';

  const baseMenuItems = [
    { id: 'dashboard', label: 'Dashboard', path: `${base}/dashboard`, icon: <DashboardIcon /> },
    { id: 'analytics', label: 'Analytics', path: `${base}/analytics`, icon: <AnalyticsIcon /> },
    ...(isUserAdmin ? [] : [{ id: 'billing', label: '요금제', path: `${base}/billing`, icon: <PaymentIcon /> }]),
    ...(isUserAdmin ? [] : [{ id: 'api-keys', label: 'API 키', path: `${base}/api-keys`, icon: <VpnKeyIcon /> }]),
  ];

  const adminMenuItems = [
    { id: 'users', label: '사용자 관리', path: `${base}/users`, icon: <PeopleIcon /> },
    { id: 'plans', label: '요금제 관리', path: `${base}/plans`, icon: <PaymentIcon /> },
    { id: 'requests', label: '요청사항', path: `${base}/requests`, icon: <EmailIcon /> },
    { id: 'request-status', label: '요청 상태', path: `${base}/request-status`, icon: <TimelineIcon /> },
  ];

  const settingsMenuItem = { id: 'settings', label: '설정', path: `${base}/settings`, icon: <SettingsIcon /> };

  const menuItems = [
    ...baseMenuItems,
    ...(user && isUserAdmin ? adminMenuItems : []),
    settingsMenuItem,
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    onItemClick?.();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ 
      backgroundColor: theme.palette.mode === 'dark' ? '#1a2332' : '#f8f9fa', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      opacity: 1,
      zIndex: 1301
    }}>
      <div style={{ padding: '16px 16px 8px 16px' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Real Captcha</Typography>
        <Typography variant="caption" color="text.secondary">Dashboard</Typography>
      </div>
      <Divider />
      <List>
        {menuItems.map(item => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton selected={isActive(item.path)} onClick={() => handleItemClick(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Sidebar;
