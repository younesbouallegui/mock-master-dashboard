import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Grid, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import ReactECharts from 'echarts-for-react';
import { fetchDashboardStats, fetchMetrics } from '../store';
import type { AppDispatch, RootState } from '../store';

const statCards = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: <TrendingUpIcon />, prefix: '$', color: '#6366f1' },
  { key: 'totalOrders', label: 'Total Orders', icon: <ShoppingCartIcon />, color: '#22c55e' },
  { key: 'totalUsers', label: 'Total Users', icon: <PeopleIcon />, color: '#3b82f6' },
  { key: 'totalProducts', label: 'Total Products', icon: <InventoryIcon />, color: '#f59e0b' },
];

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, metrics, loading } = useSelector((s: RootState) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchMetrics({}));
  }, [dispatch]);

  const revenueChartOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: 60, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category' as const, data: metrics.slice(-30).map(m => m.date.slice(5)), axisLine: { lineStyle: { color: '#475569' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value' as const, axisLabel: { color: '#94a3b8', formatter: '${value}' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [{ data: metrics.slice(-30).map(m => m.revenue), type: 'line' as const, smooth: true, areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(99,102,241,0.3)' }, { offset: 1, color: 'rgba(99,102,241,0.02)' }] } }, lineStyle: { color: '#6366f1', width: 2 }, itemStyle: { color: '#6366f1' } }],
  };

  const orderStatusOption = stats ? {
    tooltip: { trigger: 'item' as const },
    series: [{
      type: 'pie' as const, radius: ['45%', '70%'], center: ['50%', '50%'],
      data: Object.entries(stats.ordersByStatus).map(([name, value]) => ({ name, value })),
      label: { color: '#94a3b8', fontSize: 12 },
      itemStyle: { borderRadius: 6, borderColor: '#1e293b', borderWidth: 2 },
    }],
  } : {};

  const visitorsChartOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: 'category' as const, data: metrics.slice(-30).map(m => m.date.slice(5)), axisLabel: { color: '#94a3b8' }, axisLine: { lineStyle: { color: '#475569' } } },
    yAxis: { type: 'value' as const, axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(148,163,184,0.1)' } } },
    series: [
      { data: metrics.slice(-30).map(m => m.visitors), type: 'bar' as const, itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] }, barWidth: '60%' },
    ],
  };

  if (loading && !stats) {
    return (
      <Grid container spacing={3}>
        {[1,2,3,4].map(i => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statCards.map(card => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.key}>
            <Card sx={{ position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>{card.label}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {card.prefix || ''}{stats?.[card.key]?.toLocaleString() ?? '—'}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${card.color}20` }}>
                    <Box sx={{ color: card.color }}>{card.icon}</Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Revenue (Last 30 days)</Typography>
              <ReactECharts option={revenueChartOption} style={{ height: 320 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Orders by Status</Typography>
              <ReactECharts option={orderStatusOption} style={{ height: 320 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Visitors (Last 30 days)</Typography>
              <ReactECharts option={visitorsChartOption} style={{ height: 280 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
