import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { fetchDashboardStats, fetchMetrics } from '../../store';
import type { AppDispatch, RootState } from '../../store';
import { useI18n } from '../../core/i18n';
import { useTheme, alpha } from '@mui/material/styles';

const REGIONS = [
  { name: 'North America', revenue: 142500, orders: 89, growth: 12.3 },
  { name: 'Europe', revenue: 98200, orders: 67, growth: 8.7 },
  { name: 'Asia Pacific', revenue: 76800, orders: 54, growth: 15.2 },
  { name: 'Latin America', revenue: 34500, orders: 28, growth: 22.1 },
  { name: 'Middle East', revenue: 21800, orders: 15, growth: 18.5 },
  { name: 'Africa', revenue: 12400, orders: 9, growth: 31.2 },
];

export default function AnalyticsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { metrics } = useSelector((s: RootState) => s.dashboard);
  const { t } = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const textColor = theme.palette.text.secondary;
  const gridLine = isDark ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.06)';

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchMetrics({}));
  }, [dispatch]);

  const monthlyRevenue = (() => {
    const months: Record<string, number> = {};
    metrics.forEach(m => {
      const key = m.date.slice(0, 7);
      months[key] = (months[key] || 0) + m.revenue;
    });
    return Object.entries(months).slice(-12);
  })();

  const revenueBarOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: 55, right: 16, top: 16, bottom: 28 },
    xAxis: { type: 'category' as const, data: monthlyRevenue.map(([k]) => k.slice(2)), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: textColor, fontSize: 11 } },
    yAxis: { type: 'value' as const, axisLabel: { color: textColor, fontSize: 11, formatter: '${value}' }, splitLine: { lineStyle: { color: gridLine } } },
    series: [{
      data: monthlyRevenue.map(([, v]) => +v.toFixed(0)),
      type: 'bar' as const, itemStyle: { color: '#6366f1', borderRadius: [4, 4, 0, 0] }, barWidth: '50%',
    }],
  };

  const regionPieOption = {
    tooltip: { trigger: 'item' as const },
    legend: { bottom: 0, textStyle: { color: textColor, fontSize: 11 } },
    series: [{
      type: 'pie' as const, radius: ['35%', '65%'], center: ['50%', '40%'],
      data: REGIONS.map(r => ({ name: r.name, value: r.revenue })),
      label: { show: false },
      itemStyle: { borderRadius: 4, borderColor: isDark ? '#151f32' : '#fff', borderWidth: 2 },
    }],
  };

  const newUsersOption = {
    tooltip: { trigger: 'axis' as const },
    grid: { left: 40, right: 16, top: 16, bottom: 28 },
    xAxis: { type: 'category' as const, data: metrics.slice(-30).map(m => m.date.slice(5)), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: textColor, fontSize: 11 } },
    yAxis: { type: 'value' as const, axisLabel: { color: textColor, fontSize: 11 }, splitLine: { lineStyle: { color: gridLine } } },
    series: [{
      data: metrics.slice(-30).map(m => m.newUsers), type: 'line' as const, smooth: true, showSymbol: false,
      lineStyle: { color: '#ec4899', width: 2 }, itemStyle: { color: '#ec4899' },
      areaStyle: { color: { type: 'linear' as const, x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: alpha('#ec4899', 0.15) }, { offset: 1, color: alpha('#ec4899', 0.01) }] } },
    }],
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>{t.nav.analytics}</Typography>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>Monthly Revenue</Typography>
              <ReactECharts option={revenueBarOption} style={{ height: 300 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>{t.dashboard.revenueByRegion}</Typography>
              <ReactECharts option={regionPieOption} style={{ height: 300 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {REGIONS.map(r => (
          <Grid size={{ xs: 6, md: 4, lg: 2 }} key={r.name}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{r.name}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, my: 0.5 }}>${(r.revenue / 1000).toFixed(1)}k</Typography>
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>+{r.growth}%</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>New Users (30 days)</Typography>
              <ReactECharts option={newUsersOption} style={{ height: 260 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Top Products</Typography>
              {['Premium Widget Pro', 'Elite Gadget Max', 'Ultra Device 5', 'Smart Kit Ultra', 'Turbo System Elite'].map((name, i) => (
                <Box key={name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.2, borderBottom: i < 4 ? `1px solid ${theme.palette.divider}` : 'none' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, width: 20 }}>#{i + 1}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${(Math.random() * 50000 + 10000).toFixed(0)}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
