import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, Pagination, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchUsers, deleteUser, setUsersPage, setUsersSearch } from '../store';
import { api } from '../mock/api';
import type { AppDispatch, RootState } from '../store';
import type { User } from '../mock/types';

const userSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
  department: z.string().min(1, 'Department required'),
});

const statusColors: Record<string, 'success' | 'default' | 'error'> = {
  active: 'success', inactive: 'default', suspended: 'error',
};

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, page, search } = useSelector((s: RootState) => s.users);
  const { enqueueSnackbar } = useSnackbar();
  const [editUser, setEditUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: 'viewer' as const, department: '' },
  });

  useEffect(() => {
    dispatch(fetchUsers({ page, search }));
  }, [dispatch, page, search]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteUser(id));
    enqueueSnackbar('User deleted', { variant: 'success' });
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    reset({ name: user.name, email: user.email, role: user.role, department: user.department });
    setDialogOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    if (editUser) {
      await api.updateUser(editUser.id, data);
      dispatch(fetchUsers({ page, search }));
      enqueueSnackbar('User updated', { variant: 'success' });
    }
    setDialogOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Users ({total})</Typography>
        <TextField
          size="small" placeholder="Search users..."
          value={search}
          onChange={e => dispatch(setUsersSearch(e.target.value))}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
          sx={{ width: 280 }}
        />
      </Box>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={32} /></TableCell></TableRow>
                ) : items.map(user => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: 'text.secondary' }}>{user.email}</Typography></TableCell>
                    <TableCell><Chip label={user.role} size="small" variant="outlined" /></TableCell>
                    <TableCell><Typography variant="body2">{user.department}</Typography></TableCell>
                    <TableCell><Chip label={user.status} size="small" color={statusColors[user.status]} /></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEdit(user)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(user.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={Math.ceil(total / 10)} page={page} onChange={(_, p) => dispatch(setUsersPage(p))} color="primary" />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Controller name="name" control={control} render={({ field }) => (
              <TextField {...field} label="Name" error={!!errors.name} helperText={errors.name?.message} fullWidth />
            )} />
            <Controller name="email" control={control} render={({ field }) => (
              <TextField {...field} label="Email" error={!!errors.email} helperText={errors.email?.message} fullWidth />
            )} />
            <Controller name="role" control={control} render={({ field }) => (
              <TextField {...field} label="Role" select fullWidth slotProps={{ select: { native: true } }}>
                {['admin', 'manager', 'editor', 'viewer'].map(r => <option key={r} value={r}>{r}</option>)}
              </TextField>
            )} />
            <Controller name="department" control={control} render={({ field }) => (
              <TextField {...field} label="Department" error={!!errors.department} helperText={errors.department?.message} fullWidth />
            )} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
