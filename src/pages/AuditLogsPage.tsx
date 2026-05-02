import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Pagination, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAuditLogs, setAuditLogsPage } from '../store';
import type { AppDispatch, RootState } from '../store';

const actionColors: Record<string, 'success' | 'info' | 'error' | 'warning' | 'primary' | 'default'> = {
  created: 'success', updated: 'info', deleted: 'error', viewed: 'default', exported: 'warning', imported: 'primary',
};

export default function AuditLogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, page } = useSelector((s: RootState) => s.auditLogs);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchAuditLogs({ page, search }));
  }, [dispatch, page, search]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Audit Logs ({total})</Typography>
        <TextField
          size="small" placeholder="Search logs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>IP Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={32} /></TableCell></TableRow>
                ) : items.map(log => (
                  <TableRow key={log.id} hover>
                    <TableCell><Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>{new Date(log.createdAt).toLocaleString()}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 13 }}>{log.userId}</Typography></TableCell>
                    <TableCell><Chip label={log.action} size="small" color={actionColors[log.action] || 'default'} /></TableCell>
                    <TableCell><Chip label={log.resource} size="small" variant="outlined" /></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontSize: 13 }}>{log.details}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 13, color: 'text.secondary' }}>{log.ip}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={Math.ceil(total / 20)} page={page} onChange={(_, p) => dispatch(setAuditLogsPage(p))} color="primary" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
