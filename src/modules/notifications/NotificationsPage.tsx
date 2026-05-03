import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Button, CircularProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchNotifications, markAllRead } from '../../store';
import type { AppDispatch, RootState } from '../../store';
import { useI18n } from '../../core/i18n';

const icons: Record<string, JSX.Element> = {
  info: <InfoIcon sx={{ color: 'info.main', fontSize: 20 }} />,
  warning: <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />,
  error: <ErrorIcon sx={{ color: 'error.main', fontSize: 20 }} />,
  success: <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />,
};

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => s.notifications);
  const { t } = useI18n();
  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);
  const unread = items.filter(n => !n.read).length;
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{t.nav.notifications} ({items.length})</Typography>
        {unread > 0 && <Button variant="outlined" size="small" onClick={() => dispatch(markAllRead())}>Mark all read ({unread})</Button>}
      </Box>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <List disablePadding>
            {items.map((n, i) => (
              <ListItem key={n.id} sx={{
                borderBottom: i < items.length - 1 ? 1 : 0, borderColor: 'divider',
                bgcolor: n.read ? 'transparent' : (t => `rgba(99,102,241,0.04)`), py: 1.5,
              }}>
                <ListItemIcon sx={{ minWidth: 36 }}>{icons[n.type]}</ListItemIcon>
                <ListItemText primary={n.title}
                  secondary={`${n.message} — ${new Date(n.createdAt).toLocaleDateString()}`}
                  slotProps={{ primary: { sx: { fontWeight: n.read ? 400 : 600, fontSize: 13.5 } }, secondary: { sx: { fontSize: 12 } } }} />
                {!n.read && <Chip label="New" size="small" color="primary" sx={{ ml: 1, fontSize: 10, height: 20 }} />}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
