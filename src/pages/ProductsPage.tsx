import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Pagination, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';
import { fetchProducts, deleteProduct, setProductsPage, setProductsSearch } from '../store';
import type { AppDispatch, RootState } from '../store';

const statusColors: Record<string, 'success' | 'default' | 'warning'> = {
  active: 'success', draft: 'default', archived: 'warning',
};

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, page, search } = useSelector((s: RootState) => s.products);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(fetchProducts({ page, search }));
  }, [dispatch, page, search]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteProduct(id));
    enqueueSnackbar('Product deleted', { variant: 'success' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Products ({total})</Typography>
        <TextField
          size="small" placeholder="Search products..."
          value={search}
          onChange={e => dispatch(setProductsSearch(e.target.value))}
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
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><CircularProgress size={32} /></TableCell></TableRow>
                ) : items.map(product => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{product.name}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>{product.sku}</Typography></TableCell>
                    <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ color: product.stock < 10 ? 'error.main' : 'text.primary' }}>
                        {product.stock}
                      </Typography>
                    </TableCell>
                    <TableCell>{'⭐'.repeat(Math.round(product.rating))}</TableCell>
                    <TableCell><Chip label={product.status} size="small" color={statusColors[product.status]} /></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleDelete(product.id)} color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={Math.ceil(total / 10)} page={page} onChange={(_, p) => dispatch(setProductsPage(p))} color="primary" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
