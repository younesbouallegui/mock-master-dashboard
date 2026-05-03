import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Grid, Skeleton, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';
import ReactECharts from 'echarts-for-react';
import { fetchDashboardStats, fetchMetrics } from '../../store';
import type { AppDispatch, RootState } from '../../store';
import { useI18n } from '../../core/i18n';
import { useTheme, alpha } from '@mui/material/styles';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, metrics, loading } = useSelector((s: RootState) => s.dashboard);
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.secondary;
  const gridLine = isDark ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.06)';

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchMetrics({}));
  }, [dispatch]);

  const statCards = [
    { key: 'totalRevenue', label: t.dashboard.totalRevenue, icon: <AttachMoneyIcon />, prefix: '$', color: '#6366f1', change: '+12.5%' },
    { key: 'totalOrders', label: t.dashboard.totalOrders, icon: <ShoppingCartIcon />, color: '#22c55e', change: '+8.2%' },
    { key: 'totalUsers', label: t.dashboard.totalUsers, icon: <PeopleIcon />, color: '#3b82f6', change: '+5.1%' },
    { key: 'totalProducts', label: t.dashboard.totalProducts, icon: <InventoryIcon />, color: '#f59e0b', change: '+2.3%' },
  ];

  const revenueOption = {
    tooltip: { trigger: 'axis' as const, backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#e2e8f0', textStyle: { color: isDark ? '#f1f5f9' : '#0f172a' } },
    grid: { left: 55, right: 16, top: 16, bottom: 28 },
    xAxis: { type: 'category' as const, data: metrics.slice(-30).map(m => m.date.slice(5)), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: textColor, fontSize: 11 } },
    yAxis: { type: 'value' as const, axisLabel: { color: textColor, fontSize: 11, formatter: '${value}' }, splitLine: { lineStyle: { color: gridLine } } },
    series: [{
      data: metrics.slice(-30).map(m => m.revenue), type: 'line' as const, smooth: true, showSymbol: false,
      areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: alpha('#6366f1', 0.2) }, { offset: 1, color: alpha('#6366f1', 0.01) }] } },
      lineStyle: { color: '#6366f1', width: 2.5 }, itemStyle: { color: '#6366f1' },
    }],
  };

  const pieOption = stats ? {
    tooltip: { trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: textColor, fontSize: 11 } },
    series: [{
      type: 'pie' as const, radius: ['42%', '68%'], center: ['50%', '42%'],
      data: Object.entries(stats.ordersByStatus).map(([name, value]) => ({ name, value })),
      label: { show: false },
      itemStyle: { borderRadius: 4, borderColor: isDark ? '#151f32' : '#fff', borderWidth: 2 },
    }],
  } : {};

  const visitorsOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: 45, right: 16, top: 16, bottom: 28 },
    xAxis: { type: 'category' as const, data: metrics.slice(-14).map(m => m.date.slice(5)), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: textColor, fontSize: 11 } },
    yAxis: { type: 'value' as const, axisLabel: { color: textColor, fontSize: 11 }, splitLine: { lineStyle: { color: gridLine } } },
    series: [{
      data: metrics.slice(-14).map(m => m.visitors), type: 'bar' as const,
      itemStyle: { color: '#3b82f6', borderRadius: [3, 3, 0, 0] }, barWidth: '55%',
    }],
  };

  const conversionOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
    xAxis: { type: 'category' as const, data: metrics.slice(-30).map(m => m.date.slice(5)), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: textColor, fontSize: 11 } },
    yAxis: { type: 'value' as const, axisLabel: { color: textColor, fontSize: 11, formatter: '{value}%' }, splitLine: { lineStyle: { color: gridLine } } },
    series: [{
      data: metrics.slice(-30).map(m => m.conversion), type: 'line' as const, smooth: true, showSymbol: false,
      lineStyle: { color: '#22c55e', width: 2 }, itemStyle: { color: '#22c55e' },
      areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: alpha('#22c55e', 0.15) }, { offset: 1, color: alpha('#22c55e', 0.01) }] } },
    }],
  };

  if (loading && !stats) {
    return (
      <Grid container spacing={2.5}>
        {[1,2,3,4].map(i => <Grid size={{ xs: 6, md: 3 }} key={i}><Skeleton variant="rounded" height={120} sx={{ borderRadius: 2.5 }} /></Grid>)}
        <Grid size={{ xs: 12, md: 8 }}><Skeleton variant="rounded" height={320} sx={{ borderRadius: 2.5 }} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><Skeleton variant="rounded" height={320} sx={{ borderRadius: 2.5 }} /></Grid>
      </Grid>
    );
  }

  const avgOrderValue = stats ? (stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2) : '0';
  const refundRate = stats ? ((stats.ordersByStatus.refunded / (stats.totalOrders || 1)) * 100).toFixed(1) : '0';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{t.dashboard.title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.3 }}>{t.dashboard.last30Days}</Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {statCards.map(card => (
          <Grid size={{ xs: 6, md: 3 }} key={card.key}>
            <Card sx={{ position: 'relative', overflow: 'hidden' }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: 11, sm: 12.5 }, fontWeight: 500 }}>{card.label}</Typography>
                  <Box sx={{ p: 0.7, borderRadius: 1.5, bgcolor: alpha(card.color, 0.1), display: 'flex' }}>
                    <Box sx={{ color: card.color, '& svg': { fontSize: { xs: 16, sm: 18 } } }}>{card.icon}</Box>
                  </Box>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.5rem' }, mb: 0.5 }}>
                  {card.prefix || ''}{stats?.[card.key]?.toLocaleString() ?? '—'}
                </Typography>
                <Chip label={card.change} size="small" sx={{ height: 20, fontSize: 11, fontWeight: 600, bgcolor: alpha('#22c55e', 0.1), color: '#22c55e' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>{t.dashboard.revenueChart}</Typography>
              <ReactECharts option={revenueOption} style={{ height: 300 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>{t.dashboard.ordersByStatus}</Typography>
              <ReactECharts option={pieOption} style={{ height: 300 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: 12.5 }}>{t.dashboard.avgOrderValue}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>${avgOrderValue}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: 12.5 }}>{t.dashboard.refundRate}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>{refundRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: 12.5 }}>{t.dashboard.conversionRate}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {metrics.length > 0 ? (metrics.slice(-30).reduce((s, m) => s + m.conversion, 0) / 30).toFixed(1) : '0'}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontSize: 12.5 }}>{t.dashboard.salesGrowth}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>+14.2%</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>{t.dashboard.visitors}</Typography>
              <ReactECharts option={visitorsOption} style={{ height: 240 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>{t.dashboard.conversionRate}</Typography>
              <ReactECharts option={conversionOption} style={{ height: 240 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
