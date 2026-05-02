import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Pagination, CircularProgress, Tabs, Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchOrders, setOrdersPage, setOrdersStatus, setOrdersSearch } from '../store';
import type { AppDispatch, RootState } from '../store';

const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error' | 'default'> = {
  pending: 'warning', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'error', refunded: 'default',
};

const tabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, page, statusFilter, search } = useSelector((s: RootState) => s.orders);

  useEffect(() => {
    dispatch(fetchOrders({ page, status: statusFilter, search }));
  }, [dispatch, page, statusFilter, search]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Orders ({total})</Typography>
        <TextField
          size="small" placeholder="Search orders..."
          value={search}
          onChange={e => dispatch(setOrdersSearch(e.target.value))}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
          sx={{ width: 280 }}
        />
      </Box>
      <Tabs value={statusFilter} onChange={(_, v) => dispatch(setOrdersStatus(v))} sx={{ mb: 2 }} variant="scrollable">
        {tabs.map(t => <Tab key={t} label={t.charAt(0).toUpperCase() + t.slice(1)} value={t} />)}
      </Tabs>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={32} /></TableCell></TableRow>
                ) : items.map(order => (
                  <TableRow key={order.id} hover>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>{order.id}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: 'text.secondary' }}>{order.userId}</Typography></TableCell>
                    <TableCell><Chip label={order.status} size="small" color={statusColors[order.status]} /></TableCell>
                    <TableCell><Chip label={order.paymentMethod.replace('_', ' ')} size="small" variant="outlined" /></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>${order.total.toFixed(2)}</TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: 'text.secondary' }}>{new Date(order.createdAt).toLocaleDateString()}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={Math.ceil(total / 10)} page={page} onChange={(_, p) => dispatch(setOrdersPage(p))} color="primary" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
