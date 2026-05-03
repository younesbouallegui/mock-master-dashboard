import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { store } from './store';
import { AuthProvider, useAuth } from './core/auth/AuthContext';
import { I18nProvider } from './core/i18n';
import { AppThemeProvider } from './core/theme';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './modules/auth/LoginPage';
import DashboardPage from './modules/dashboard/DashboardPage';
import AnalyticsPage from './modules/analytics/AnalyticsPage';
import UsersPage from './modules/users/UsersPage';
import ProductsPage from './modules/products/ProductsPage';
import OrdersPage from './modules/orders/OrdersPage';
import CategoriesPage from './modules/categories/CategoriesPage';
import NotificationsPage from './modules/notifications/NotificationsPage';
import AuditLogsPage from './modules/audit/AuditLogsPage';
import SettingsPage from './modules/settings/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <I18nProvider>
        <AppThemeProvider>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={3000}>
            <AuthProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </AuthProvider>
          </SnackbarProvider>
        </AppThemeProvider>
      </I18nProvider>
    </Provider>
  );
}
