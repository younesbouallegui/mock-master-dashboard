import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Pagination, CircularProgress, Tabs, Tab, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, Stepper, Step, StepLabel, Select,
  MenuItem, FormControl, InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchOrders, setOrdersPage, setOrdersStatus, setOrdersSearch } from '../../store';
import { api } from '../../mock/api';
import type { AppDispatch, RootState } from '../../store';
import { useI18n } from '../../core/i18n';
import { useSnackbar } from 'notistack';

const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error' | 'default'> = {
  pending: 'warning', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'error', refunded: 'default',
};
const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, page, statusFilter, search } = useSelector((s: RootState) => s.orders);
  const { t } = useI18n();
  const { enqueueSnackbar } = useSnackbar();
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');

  const tabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

  useEffect(() => { dispatch(fetchOrders({ page, status: statusFilter, search })); }, [dispatch, page, statusFilter, search]);

  const openDetail = (order: any) => { setSelectedOrder(order); setNewStatus(order.status); setDetailOpen(true); };

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus !== selectedOrder.status) {
      await api.updateOrder(selectedOrder.id, { status: newStatus as any });
      enqueueSnackbar(`Order updated to ${newStatus}`, { variant: 'success' });
      dispatch(fetchOrders({ page, status: statusFilter, search }));
      setDetailOpen(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{t.orders.title} ({total})</Typography>
        <TextField size="small" placeholder={t.orders.search} value={search}
          onChange={e => dispatch(setOrdersSearch(e.target.value))}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment> } }}
          sx={{ width: { xs: '100%', sm: 240 } }} />
      </Box>
      <Tabs value={statusFilter} onChange={(_, v) => dispatch(setOrdersStatus(v))} sx={{ mb: 2 }} variant="scrollable" scrollButtons="auto">
        {tabs.map(tb => <Tab key={tb} label={(t.orders as any)[tb] || tb} value={tb} sx={{ fontSize: 13, minWidth: 'auto' }} />)}
      </Tabs>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t.orders.orderId}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{t.orders.customer}</TableCell>
                  <TableCell>{t.orders.status}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{t.orders.payment}</TableCell>
                  <TableCell align="right">{t.orders.total}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{t.orders.date}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={28} /></TableCell></TableRow>
                ) : items.map(order => (
                  <TableRow key={order.id} hover sx={{ cursor: 'pointer' }} onClick={() => openDetail(order)}>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500, fontSize: 12 }}>{order.id}</Typography></TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>{order.userId}</Typography></TableCell>
                    <TableCell><Chip label={order.status} size="small" color={statusColors[order.status]} sx={{ fontSize: 11 }} /></TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Chip label={order.paymentMethod.replace('_', ' ')} size="small" variant="outlined" sx={{ fontSize: 11 }} /></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>${order.total.toFixed(2)}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString()}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={Math.ceil(total / 10)} page={page} onChange={(_, p) => dispatch(setOrdersPage(p))} color="primary" size="small" />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        {selectedOrder && (
          <>
            <DialogTitle>{t.orders.orderDetails} — {selectedOrder.id}</DialogTitle>
            <DialogContent>
              <Stepper activeStep={statusSteps.indexOf(selectedOrder.status)} alternativeLabel sx={{ my: 2 }}>
                {statusSteps.map(s => <Step key={s} completed={statusSteps.indexOf(s) <= statusSteps.indexOf(selectedOrder.status)}><StepLabel>{s}</StepLabel></Step>)}
              </Stepper>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
                <Box><Typography variant="caption" sx={{ color: 'text.secondary' }}>{t.orders.total}</Typography><Typography variant="h6">${selectedOrder.total.toFixed(2)}</Typography></Box>
                <Box><Typography variant="caption" sx={{ color: 'text.secondary' }}>Subtotal</Typography><Typography variant="h6">${selectedOrder.subtotal.toFixed(2)}</Typography></Box>
                <Box><Typography variant="caption" sx={{ color: 'text.secondary' }}>Tax</Typography><Typography variant="body1">${selectedOrder.tax.toFixed(2)}</Typography></Box>
                <Box><Typography variant="caption" sx={{ color: 'text.secondary' }}>Shipping</Typography><Typography variant="body1">${selectedOrder.shipping.toFixed(2)}</Typography></Box>
                <Box sx={{ gridColumn: '1/-1' }}><Typography variant="caption" sx={{ color: 'text.secondary' }}>Address</Typography><Typography variant="body2">{selectedOrder.shippingAddress}</Typography></Box>
              </Box>
              <FormControl fullWidth size="small" sx={{ mt: 3 }}>
                <InputLabel>{t.orders.updateStatus}</InputLabel>
                <Select value={newStatus} onChange={e => setNewStatus(e.target.value)} label={t.orders.updateStatus}>
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setDetailOpen(false)}>{t.common.close}</Button>
              <Button variant="contained" onClick={handleUpdateStatus} disabled={newStatus === selectedOrder.status}>{t.orders.updateStatus}</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
