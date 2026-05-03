import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, Pagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchUsers, deleteUser, setUsersPage, setUsersSearch } from '../../store';
import { api } from '../../mock/api';
import type { AppDispatch, RootState } from '../../store';
import type { User } from '../../mock/types';
import { useI18n } from '../../core/i18n';
import { useAuth, hasPermission } from '../../core/auth/AuthContext';

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
  department: z.string().min(1, 'Department required'),
  status: z.enum(['active', 'inactive', 'suspended']),
});

const statusColors: Record<string, 'success' | 'default' | 'error'> = { active: 'success', inactive: 'default', suspended: 'error' };

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, page, search } = useSelector((s: RootState) => s.users);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useI18n();
  const { user: authUser } = useAuth();
  const canEdit = authUser ? hasPermission(authUser.role, 'manager') : false;
  const [editUser, setEditUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: 'viewer' as const, department: '', status: 'active' as const },
  });

  useEffect(() => { dispatch(fetchUsers({ page, search })); }, [dispatch, page, search]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteUser(id));
    enqueueSnackbar('User deleted', { variant: 'success' });
  };

  const handleEdit = (user: User) => {
    setEditUser(user); setIsNew(false);
    reset({ name: user.name, email: user.email, role: user.role, department: user.department, status: user.status });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditUser(null); setIsNew(true);
    reset({ name: '', email: '', role: 'viewer', department: '', status: 'active' });
    setDialogOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    if (isNew) {
      await api.createUser({
        id: `usr-${Date.now()}`, ...data,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        phone: '', joinedAt: new Date().toISOString(), lastLogin: new Date().toISOString(),
      });
      enqueueSnackbar('User created', { variant: 'success' });
    } else if (editUser) {
      await api.updateUser(editUser.id, data);
      enqueueSnackbar('User updated', { variant: 'success' });
    }
    dispatch(fetchUsers({ page, search }));
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{t.users.title} ({total})</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" placeholder={t.users.search} value={search}
            onChange={e => dispatch(setUsersSearch(e.target.value))}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment> } }}
            sx={{ width: { xs: '100%', sm: 240 } }} />
          {canEdit && (
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAdd}>{t.users.addUser}</Button>
          )}
        </Box>
      </Box>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t.users.name}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t.users.email}</TableCell>
                  <TableCell>{t.users.role}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{t.users.department}</TableCell>
                  <TableCell>{t.users.status}</TableCell>
                  {canEdit && <TableCell align="right">{t.users.actions}</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={28} /></TableCell></TableRow>
                ) : items.map(user => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={user.avatar} sx={{ width: 30, height: 30 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Typography variant="body2" sx={{ color: 'text.secondary' }}>{user.email}</Typography></TableCell>
                    <TableCell><Chip label={user.role} size="small" variant="outlined" sx={{ fontSize: 11 }} /></TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Typography variant="body2">{user.department}</Typography></TableCell>
                    <TableCell><Chip label={user.status} size="small" color={statusColors[user.status]} sx={{ fontSize: 11 }} /></TableCell>
                    {canEdit && (
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEdit(user)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(user.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={Math.ceil(total / 10)} page={page} onChange={(_, p) => dispatch(setUsersPage(p))} color="primary" size="small" />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isNew ? t.users.addUser : t.users.editUser}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Controller name="name" control={control} render={({ field }) => (
              <TextField {...field} label={t.users.name} error={!!errors.name} helperText={errors.name?.message} fullWidth size="small" />
            )} />
            <Controller name="email" control={control} render={({ field }) => (
              <TextField {...field} label={t.users.email} error={!!errors.email} helperText={errors.email?.message} fullWidth size="small" />
            )} />
            <Controller name="role" control={control} render={({ field }) => (
              <TextField {...field} label={t.users.role} select fullWidth size="small" slotProps={{ select: { native: true } }}>
                {['admin', 'manager', 'editor', 'viewer'].map(r => <option key={r} value={r}>{r}</option>)}
              </TextField>
            )} />
            <Controller name="department" control={control} render={({ field }) => (
              <TextField {...field} label={t.users.department} error={!!errors.department} helperText={errors.department?.message} fullWidth size="small" />
            )} />
            <Controller name="status" control={control} render={({ field }) => (
              <TextField {...field} label={t.users.status} select fullWidth size="small" slotProps={{ select: { native: true } }}>
                {['active', 'inactive', 'suspended'].map(s => <option key={s} value={s}>{s}</option>)}
              </TextField>
            )} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>{t.common.cancel}</Button>
            <Button type="submit" variant="contained">{t.common.save}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
