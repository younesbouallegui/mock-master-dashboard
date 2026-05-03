import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Tooltip,
  AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Divider,
  useMediaQuery, useTheme, Menu, MenuItem, InputBase, alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TranslateIcon from '@mui/icons-material/Translate';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useAuth } from '../../core/auth/AuthContext';
import { useI18n } from '../../core/i18n';
import { useThemeMode } from '../../core/theme';
import logo from '../../assets/logo.png';

const DRAWER_FULL = 240;
const DRAWER_MINI = 68;

export default function AppLayout() {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useSelector((s: RootState) => s.notifications.items);
  const unreadCount = notifications.filter(n => !n.read).length;
  const { user, logout } = useAuth();
  const { t, lang, setLanguage } = useI18n();
  const { mode, toggleTheme } = useThemeMode();

  const drawerWidth = isMobile ? DRAWER_FULL : collapsed ? DRAWER_MINI : DRAWER_FULL;

  const navItems = [
    { label: t.nav.dashboard, icon: <DashboardIcon />, path: '/' },
    { label: t.nav.analytics, icon: <AnalyticsIcon />, path: '/analytics' },
    { label: t.nav.users, icon: <PeopleIcon />, path: '/users' },
    { label: t.nav.products, icon: <InventoryIcon />, path: '/products' },
    { label: t.nav.orders, icon: <ShoppingCartIcon />, path: '/orders' },
    { label: t.nav.categories, icon: <CategoryIcon />, path: '/categories' },
    { label: t.nav.notifications, icon: <NotificationsIcon />, path: '/notifications' },
    { label: t.nav.auditLogs, icon: <HistoryIcon />, path: '/audit-logs' },
    { label: t.nav.settings, icon: <SettingsIcon />, path: '/settings' },
  ];

  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ p: collapsed && !isMobile ? 1.5 : 2, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <img src={logo} alt="FB" style={{ height: collapsed && !isMobile ? 32 : 36, width: 'auto' }} />
        </Box>
        {(!collapsed || isMobile) && (
          <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap' }}>
            {t.app.name}
          </Typography>
        )}
        {!isMobile && (
          <IconButton size="small" onClick={() => setCollapsed(!collapsed)} sx={{ ml: 'auto', color: 'text.secondary' }}>
            {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>
      <Divider />
      <List sx={{ flex: 1, px: collapsed && !isMobile ? 0.75 : 1.5, py: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map(item => {
          const active = isActive(item.path);
          const btn = (
            <ListItemButton
              key={item.path}
              onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
              selected={active}
              sx={{
                borderRadius: 2, mb: 0.3, py: 1,
                minHeight: 42,
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                px: collapsed && !isMobile ? 1.5 : 1.5,
                '&.Mui-selected': {
                  bgcolor: alpha(muiTheme.palette.primary.main, 0.12),
                  '&:hover': { bgcolor: alpha(muiTheme.palette.primary.main, 0.18) },
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: collapsed && !isMobile ? 0 : 36,
                mr: collapsed && !isMobile ? 0 : 1,
                color: active ? 'primary.main' : 'text.secondary',
                justifyContent: 'center',
              }}>
                {item.icon}
              </ListItemIcon>
              {(!collapsed || isMobile) && (
                <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontSize: 13.5, fontWeight: active ? 600 : 400 } } }} />
              )}
            </ListItemButton>
          );
          return collapsed && !isMobile ? <Tooltip key={item.path} title={item.label} placement="right">{btn}</Tooltip> : <Box key={item.path}>{btn}</Box>;
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_FULL, bgcolor: 'background.paper' } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{
          width: drawerWidth,
          transition: 'width 0.2s ease',
          '& .MuiDrawer-paper': {
            width: drawerWidth, bgcolor: 'background.paper',
            borderRight: `1px solid ${muiTheme.palette.divider}`,
            transition: 'width 0.2s ease', overflowX: 'hidden',
          },
        }}>
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: { md: `calc(100% - ${drawerWidth}px)` }, transition: 'width 0.2s ease' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: `1px solid ${muiTheme.palette.divider}` }}>
          <Toolbar sx={{ gap: 1 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} size="small">
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{
              display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1,
              bgcolor: alpha(muiTheme.palette.text.primary, 0.04),
              borderRadius: 2, px: 1.5, py: 0.5, flex: 1, maxWidth: 360,
            }}>
              <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              <InputBase placeholder={t.common.search} sx={{ flex: 1, fontSize: 14 }} />
            </Box>
            <Box sx={{ flex: 1 }} />
            <IconButton size="small" onClick={e => setLangAnchor(e.currentTarget)}>
              <TranslateIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
            </IconButton>
            <IconButton size="small" onClick={toggleTheme}>
              {mode === 'dark' ? <LightModeIcon sx={{ color: 'text.secondary', fontSize: 20 }} /> : <DarkModeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />}
            </IconButton>
            <IconButton size="small" onClick={() => navigate('/notifications')}>
              <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}>
                <NotificationsIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </Badge>
            </IconButton>
            <IconButton size="small" onClick={e => setProfileAnchor(e.currentTarget)}>
              <Avatar src={user?.avatar} sx={{ width: 32, height: 32, fontSize: 13 }}>
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ flex: 1, p: { xs: 2, sm: 2.5, md: 3 }, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>

      <Menu anchorEl={profileAnchor} open={!!profileAnchor} onClose={() => setProfileAnchor(null)}
        slotProps={{ paper: { sx: { width: 200, mt: 1 } } }}>
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2">{user?.name}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{user?.role?.replace('_', ' ')}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { setProfileAnchor(null); navigate('/settings'); }}>
          <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />{t.nav.settings}
        </MenuItem>
        <MenuItem onClick={() => { setProfileAnchor(null); logout(); }}>
          <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />{t.auth.signOut}
        </MenuItem>
      </Menu>

      <Menu anchorEl={langAnchor} open={!!langAnchor} onClose={() => setLangAnchor(null)}>
        <MenuItem selected={lang === 'en'} onClick={() => { setLanguage('en'); setLangAnchor(null); }}>
          🇺🇸 English
        </MenuItem>
        <MenuItem selected={lang === 'fr'} onClick={() => { setLanguage('fr'); setLangAnchor(null); }}>
          🇫🇷 Français
        </MenuItem>
      </Menu>
    </Box>
  );
}
