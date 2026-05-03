import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, TextField, Button,
  Switch, FormControlLabel, Divider, Grid, Alert, Select, MenuItem,
  FormControl, InputLabel,
} from '@mui/material';
import { useI18n } from '../../core/i18n';
import { useThemeMode } from '../../core/theme';
import { useAuth } from '../../core/auth/AuthContext';
import logo from '../../assets/logo.png';

export default function SettingsPage() {
  const { t, lang, setLanguage } = useI18n();
  const { mode, setMode } = useThemeMode();
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(false);
  const [companyName, setCompanyName] = useState('FB Technologies');
  const [timezone, setTimezone] = useState('UTC');
  const [currency, setCurrency] = useState('USD');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>{t.settings.title}</Typography>
      {saved && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{t.settings.saved}</Alert>}

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label={t.settings.general} />
          <Tab label={t.settings.appearance} />
          <Tab label={t.settings.branding} />
          <Tab label={t.settings.security} />
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label={t.settings.companyName} value={companyName} onChange={e => setCompanyName(e.target.value)} size="small" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t.settings.timezone}</InputLabel>
                  <Select value={timezone} onChange={e => setTimezone(e.target.value)} label={t.settings.timezone}>
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="EST">Eastern Time</MenuItem>
                    <MenuItem value="PST">Pacific Time</MenuItem>
                    <MenuItem value="CET">Central European</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t.settings.currency}</InputLabel>
                  <Select value={currency} onChange={e => setCurrency(e.target.value)} label={t.settings.currency}>
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR (€)</MenuItem>
                    <MenuItem value="GBP">GBP (£)</MenuItem>
                    <MenuItem value="CAD">CAD (C$)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t.settings.language}</InputLabel>
                  <Select value={lang} onChange={e => setLanguage(e.target.value as 'en' | 'fr')} label={t.settings.language}>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" onClick={handleSave}>{t.settings.save}</Button>
              </Grid>
            </Grid>
          )}

          {tab === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{t.settings.theme}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                {(['light', 'dark'] as const).map(m => (
                  <Card key={m} onClick={() => setMode(m)} sx={{
                    cursor: 'pointer', width: 140, border: mode === m ? '2px solid' : '1px solid',
                    borderColor: mode === m ? 'primary.main' : 'divider',
                  }}>
                    <CardContent sx={{ p: 2, textAlign: 'center' }}>
                      <Box sx={{ width: '100%', height: 60, borderRadius: 1, mb: 1, bgcolor: m === 'dark' ? '#0c1222' : '#f8fafc' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{m === 'dark' ? t.settings.dark : t.settings.light}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          {tab === 2 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{t.settings.branding}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Box sx={{ p: 2, border: '2px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center', width: 160 }}>
                  <img src={logo} alt="Logo" style={{ height: 48, width: 'auto', display: 'block', margin: '0 auto 8px' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t.settings.companyLogo}</Typography>
                </Box>
                <Box>
                  <TextField label={t.settings.companyName} value={companyName} onChange={e => setCompanyName(e.target.value)} size="small" sx={{ mb: 1.5 }} fullWidth />
                  <Button variant="outlined" size="small">Upload Logo</Button>
                </Box>
              </Box>
              <Button variant="contained" onClick={handleSave}>{t.settings.save}</Button>
            </Box>
          )}

          {tab === 3 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>{t.settings.security}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel control={<Switch defaultChecked />} label="Two-Factor Authentication" />
                <FormControlLabel control={<Switch defaultChecked />} label="Session Timeout (30 min)" />
                <FormControlLabel control={<Switch />} label="IP Whitelisting" />
                <Divider sx={{ my: 1 }} />
                <TextField label="Current Password" type="password" size="small" sx={{ maxWidth: 360 }} />
                <TextField label="New Password" type="password" size="small" sx={{ maxWidth: 360 }} />
                <TextField label="Confirm Password" type="password" size="small" sx={{ maxWidth: 360 }} />
                <Button variant="contained" sx={{ maxWidth: 160 }} onClick={handleSave}>Update Password</Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
