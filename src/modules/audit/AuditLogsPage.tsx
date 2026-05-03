import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Card, CardContent, Typography, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Pagination, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchAuditLogs, setAuditLogsPage } from '../../store';
import type { AppDispatch, RootState } from '../../store';
import { useI18n } from '../../core/i18n';

const actionColors: Record<string, 'success' | 'info' | 'error' | 'warning' | 'primary' | 'default'> = {
  created: 'success', updated: 'info', deleted: 'error', viewed: 'default', exported: 'warning', imported: 'primary',
};

export default function AuditLogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, loading, page } = useSelector((s: RootState) => s.auditLogs);
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  useEffect(() => { dispatch(fetchAuditLogs({ page, search })); }, [dispatch, page, search]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{t.nav.auditLogs} ({total})</Typography>
        <TextField size="small" placeholder={t.common.search} value={search}
          onChange={e => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} /></InputAdornment> } }}
          sx={{ width: { xs: '100%', sm: 240 } }} />
      </Box>
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Details</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>IP</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={28} /></TableCell></TableRow>
                ) : items.map(log => (
                  <TableRow key={log.id} hover>
                    <TableCell><Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>{new Date(log.createdAt).toLocaleString()}</Typography></TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 11.5 }}>{log.userId}</Typography></TableCell>
                    <TableCell><Chip label={log.action} size="small" color={actionColors[log.action] || 'default'} sx={{ fontSize: 11 }} /></TableCell>
                    <TableCell><Chip label={log.resource} size="small" variant="outlined" sx={{ fontSize: 11 }} /></TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Typography variant="body2" sx={{ fontSize: 12 }}>{log.details}</Typography></TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 11.5, color: 'text.secondary' }}>{log.ip}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination count={Math.ceil(total / 20)} page={page} onChange={(_, p) => dispatch(setAuditLogsPage(p))} color="primary" size="small" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
