import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Pagination, CircularProgress, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { fetchProducts, deleteProduct, setProductsPage, setProductsSearch } from '../../store';
import { api } from '../../mock/api';
import type { AppDispatch, RootState } from '../../store';
import { useI18n } from '../../core/i18n';
import { useAuth, hasPermission } from '../../core/auth/AuthContext';

const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(3),
  price: z.coerce.number().min(0.01),
  stock: z.coerce.number().min(0),
  status: z.enum(['active', 'draft', 'archived']),
  description: z.string().optional(),
});

const statusColors: Record<string, 'success' | 'default' | 'warning'> = { active: 'success', draft: 'default', archived: 'warning' };

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, page, search } = useSelector((s: RootState) => s.products);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useI18n();
  const { user } = useAuth();
  const canEdit = user ? hasPermission(user.role, 'manager') : false;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const lowStockItems = items.filter(p => p.stock < 10 && p.stock > 0);

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', sku: '', price: 0, stock: 0, status: 'draft' as const, description: '' },
  });

  useEffect(() => { dispatch(fetchProducts({ page, search })); }, [dispatch, page, search]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteProduct(id));
    enqueueSnackbar('Product deleted', { variant: 'success' });
  };

  const handleEdit = (p: any) => {
    setEditId(p.id);
    reset({ name: p.name, sku: p.sku, price: p.price, stock: p.stock, status: p.status, description: p.description });
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditId(null);
    reset({ name: '', sku: `SKU-${Date.now().toString().slice(-5)}`, price: 0, stock: 0, status: 'draft', description: '' });
    setDialogOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    if (editId) {
      await api.updateProduct(editId, data);
      enqueueSnackbar('Product updated', { variant: 'success' });
    } else {
      await api.createProduct({
        id: `prd-${Date.now()}`, ...data, categoryId: 'cat-0002',
        image: 'https://picsum.photos/seed/new/200/200', rating: 0, createdAt: new Date().toISOString(),
        description: data.description || '',
      });
      enqueueSnackbar('Product created', { variant: 'success' });
    }
    dispatch(fetchProducts({ page, search }));
    setDialogOpen(false);
  };

  return (
    <Box>
      {lowStockItems.length > 0 && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2, borderRadius: 2 }}>
          {t.products.lowStockAlert}: {lowStockItems.length} products below threshold
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{t.products.title} ({total})</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField size="small" placeholder={t.products.search} value={search}
            onChange={e => dispatch(setProductsSearch(e.target.value))}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment> } }}
            sx={{ width: { xs: '100%', sm: 240 } }} />
          {canEdit && <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAdd}>{t.products.addProduct}</Button>}
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t.products.name}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{t.products.sku}</TableCell>
                  <TableCell align="right">{t.products.price}</TableCell>
                  <TableCell align="right">{t.products.stock}</TableCell>
                  <TableCell>{t.products.status}</TableCell>
                  {canEdit && <TableCell align="right">{t.common.actions}</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={28} /></TableCell></TableRow>
                ) : items.map(product => (
                  <TableRow key={product.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{product.name}</Typography></TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace', fontSize: 12 }}>{product.sku}</Typography></TableCell>
                    <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ color: product.stock === 0 ? 'error.main' : product.stock < 10 ? 'warning.main' : 'text.primary', fontWeight: product.stock < 10 ? 600 : 400 }}>
                        {product.stock}
                      </Typography>
                    </TableCell>
                    <TableCell><Chip label={product.status} size="small" color={statusColors[product.status]} sx={{ fontSize: 11 }} /></TableCell>
                    {canEdit && (
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleEdit(product)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(product.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={Math.ceil(total / 10)} page={page} onChange={(_, p) => dispatch(setProductsPage(p))} color="primary" size="small" />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? t.products.editProduct : t.products.addProduct}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Controller name="name" control={control} render={({ field }) => <TextField {...field} label={t.products.name} error={!!errors.name} fullWidth size="small" />} />
            <Controller name="sku" control={control} render={({ field }) => <TextField {...field} label={t.products.sku} error={!!errors.sku} fullWidth size="small" />} />
            <Controller name="price" control={control} render={({ field }) => <TextField {...field} label={t.products.price} type="number" error={!!errors.price} fullWidth size="small" />} />
            <Controller name="stock" control={control} render={({ field }) => <TextField {...field} label={t.products.stock} type="number" error={!!errors.stock} fullWidth size="small" />} />
            <Controller name="status" control={control} render={({ field }) => (
              <TextField {...field} label={t.products.status} select fullWidth size="small" slotProps={{ select: { native: true } }}>
                {['active', 'draft', 'archived'].map(s => <option key={s} value={s}>{s}</option>)}
              </TextField>
            )} />
            <Controller name="description" control={control} render={({ field }) => <TextField {...field} label={t.products.description} multiline rows={3} fullWidth size="small" />} />
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
