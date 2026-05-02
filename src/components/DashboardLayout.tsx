import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Divider, useMediaQuery, useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Users', icon: <PeopleIcon />, path: '/users' },
  { label: 'Products', icon: <InventoryIcon />, path: '/products' },
  { label: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
  { label: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { label: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { label: 'Audit Logs', icon: <HistoryIcon />, path: '/audit-logs' },
];

export default function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useSelector((s: RootState) => s.notifications.items);
  const unreadCount = notifications.filter(n => !n.read).length;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg, #6366f1, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>A</Typography>
        </Box>
        <Typography variant="h6" sx={{ fontSize: 18 }}>AdminHub</Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: 1.5, py: 1 }}>
        {navItems.map(item => (
          <ListItemButton
            key={item.path}
            onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2, mb: 0.5, py: 1.2,
              '&.Mui-selected': { bgcolor: 'rgba(99,102,241,0.15)', '&:hover': { bgcolor: 'rgba(99,102,241,0.2)' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 14, fontWeight: location.pathname === item.path ? 600 : 400 } } }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: 'background.paper' } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: 'background.paper', borderRight: '1px solid rgba(148,163,184,0.1)' } }}>
          {drawerContent}
        </Drawer>
      )}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - ${DRAWER_WIDTH}px)` } }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
          <Toolbar>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flex: 1, fontSize: 16 }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </Typography>
            <IconButton onClick={() => navigate('/notifications')}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon sx={{ color: 'text.secondary' }} />
              </Badge>
            </IconButton>
            <Avatar sx={{ ml: 2, width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>AD</Avatar>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
