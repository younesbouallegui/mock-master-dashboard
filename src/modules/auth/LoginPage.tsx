import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, Checkbox,
  FormControlLabel, CircularProgress, Alert, InputAdornment, IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../core/auth/AuthContext';
import { useI18n } from '../../core/i18n';
import logo from '../../assets/logo.png';

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('admin@fb.com');
  const [password, setPassword] = useState('admin123');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'forgot' | 'reset'>('login');
  const [forgotEmail, setForgotEmail] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, remember);
    setLoading(false);
    if (!result.success) setError(result.error || t.auth.invalidCredentials);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(t.auth.forgotSuccess);
    setTimeout(() => { setMode('login'); setSuccess(''); }, 3000);
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0c1222 0%, #1a1a3e 50%, #0c1222 100%)',
      p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', mb: 2 }}>
            <img src={logo} alt="FB Admin" style={{ height: 56, width: 'auto' }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#f1f5f9', fontWeight: 700, mb: 0.5 }}>
            {mode === 'login' ? t.auth.signIn : mode === 'forgot' ? t.auth.forgotTitle : t.auth.resetTitle}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {mode === 'login' ? t.auth.loginSubtitle : mode === 'forgot' ? t.auth.forgotSubtitle : t.auth.resetSubtitle}
          </Typography>
        </Box>
        <Card sx={{ bgcolor: 'rgba(21,31,50,0.8)', border: '1px solid rgba(148,163,184,0.1)', backdropFilter: 'blur(20px)' }}>
          <CardContent sx={{ p: 3.5 }}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

            {mode === 'login' && (
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth label={t.auth.email} value={email} onChange={e => setEmail(e.target.value)}
                  type="email" required sx={{ mb: 2 }} size="small"
                />
                <TextField
                  fullWidth label={t.auth.password} value={password} onChange={e => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'} required sx={{ mb: 1.5 }} size="small"
                  slotProps={{ input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={remember} onChange={e => setRemember(e.target.checked)} />}
                    label={<Typography variant="body2">{t.auth.rememberMe}</Typography>}
                  />
                  <Typography variant="body2" sx={{ color: 'primary.main', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                    onClick={() => setMode('forgot')}>{t.auth.forgotPassword}</Typography>
                </Box>
                <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                  sx={{ py: 1.3, fontSize: '0.9375rem', borderRadius: 2, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : t.auth.login}
                </Button>
              </form>
            )}

            {mode === 'forgot' && (
              <form onSubmit={handleForgot}>
                <TextField
                  fullWidth label={t.auth.email} value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                  type="email" required sx={{ mb: 2.5 }} size="small"
                />
                <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                  sx={{ py: 1.3, mb: 1.5, borderRadius: 2, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                  {loading ? <CircularProgress size={22} color="inherit" /> : t.auth.sendReset}
                </Button>
                <Button fullWidth onClick={() => setMode('login')} sx={{ color: 'text.secondary' }}>
                  {t.auth.backToLogin}
                </Button>
              </form>
            )}

            {mode === 'login' && (
              <Box sx={{ mt: 3, pt: 2.5, borderTop: '1px solid rgba(148,163,184,0.1)', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#475569' }}>
                  Demo: admin@fb.com / admin123
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
