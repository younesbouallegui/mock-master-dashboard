import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, List, ListItem, ListItemIcon,
  ListItemText, Chip, Button, CircularProgress,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchNotifications, markAllRead } from '../store';
import type { AppDispatch, RootState } from '../store';

const icons: Record<string, JSX.Element> = {
  info: <InfoIcon sx={{ color: 'info.main' }} />,
  warning: <WarningIcon sx={{ color: 'warning.main' }} />,
  error: <ErrorIcon sx={{ color: 'error.main' }} />,
  success: <CheckCircleIcon sx={{ color: 'success.main' }} />,
};

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const unread = items.filter(n => !n.read).length;

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Notifications ({items.length})</Typography>
        {unread > 0 && (
          <Button variant="outlined" size="small" onClick={() => dispatch(markAllRead())}>
            Mark all as read ({unread})
          </Button>
        )}
      </Box>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <List disablePadding>
            {items.map((n, i) => (
              <ListItem
                key={n.id}
                sx={{
                  borderBottom: i < items.length - 1 ? '1px solid rgba(148,163,184,0.1)' : 'none',
                  bgcolor: n.read ? 'transparent' : 'rgba(99,102,241,0.05)',
                  py: 2,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{icons[n.type]}</ListItemIcon>
                <ListItemText
                  primary={n.title}
                  secondary={`${n.message} — ${new Date(n.createdAt).toLocaleDateString()}`}
                  slotProps={{ primary: { sx: { fontWeight: n.read ? 400 : 600, fontSize: 14 } }, secondary: { sx: { fontSize: 13 } } }}
                />
                {!n.read && <Chip label="New" size="small" color="primary" sx={{ ml: 1 }} />}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
