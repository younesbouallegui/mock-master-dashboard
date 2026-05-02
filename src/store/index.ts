import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../mock/api';
import type { User, Product, Order, Category, Notification, AuditLog, Metric } from '../mock/types';

// Dashboard slice
interface DashboardState {
  stats: any | null;
  metrics: Metric[];
  loading: boolean;
}

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', () => api.getDashboardStats());
export const fetchMetrics = createAsyncThunk('dashboard/fetchMetrics', (params?: { start?: string; end?: string }) =>
  api.getMetrics(params?.start, params?.end)
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { stats: null, metrics: [], loading: false } as DashboardState,
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchDashboardStats.pending, s => { s.loading = true; });
    b.addCase(fetchDashboardStats.fulfilled, (s, a) => { s.stats = a.payload; s.loading = false; });
    b.addCase(fetchMetrics.fulfilled, (s, a) => { s.metrics = a.payload; });
  },
});

// Users slice
interface UsersState {
  items: User[];
  total: number;
  loading: boolean;
  page: number;
  search: string;
}

export const fetchUsers = createAsyncThunk('users/fetch', (params: { page: number; search?: string }) =>
  api.getUsers(params.page, 10, params.search)
);
export const deleteUser = createAsyncThunk('users/delete', (id: string) => api.deleteUser(id).then(() => id));

const usersSlice = createSlice({
  name: 'users',
  initialState: { items: [], total: 0, loading: false, page: 1, search: '' } as UsersState,
  reducers: {
    setUsersPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setUsersSearch: (s, a: PayloadAction<string>) => { s.search = a.payload; s.page = 1; },
  },
  extraReducers: b => {
    b.addCase(fetchUsers.pending, s => { s.loading = true; });
    b.addCase(fetchUsers.fulfilled, (s, a) => { s.items = a.payload.data; s.total = a.payload.total; s.loading = false; });
    b.addCase(deleteUser.fulfilled, (s, a) => { s.items = s.items.filter(u => u.id !== a.payload); s.total--; });
  },
});

// Products slice
interface ProductsState {
  items: Product[];
  total: number;
  loading: boolean;
  page: number;
  search: string;
}

export const fetchProducts = createAsyncThunk('products/fetch', (params: { page: number; search?: string; categoryId?: string }) =>
  api.getProducts(params.page, 10, params.search, params.categoryId)
);
export const deleteProduct = createAsyncThunk('products/delete', (id: string) => api.deleteProduct(id).then(() => id));

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], total: 0, loading: false, page: 1, search: '' } as ProductsState,
  reducers: {
    setProductsPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setProductsSearch: (s, a: PayloadAction<string>) => { s.search = a.payload; s.page = 1; },
  },
  extraReducers: b => {
    b.addCase(fetchProducts.pending, s => { s.loading = true; });
    b.addCase(fetchProducts.fulfilled, (s, a) => { s.items = a.payload.data; s.total = a.payload.total; s.loading = false; });
    b.addCase(deleteProduct.fulfilled, (s, a) => { s.items = s.items.filter(p => p.id !== a.payload); s.total--; });
  },
});

// Orders slice
interface OrdersState {
  items: Order[];
  total: number;
  loading: boolean;
  page: number;
  statusFilter: string;
  search: string;
}

export const fetchOrders = createAsyncThunk('orders/fetch', (params: { page: number; status?: string; search?: string }) =>
  api.getOrders(params.page, 10, params.status, params.search)
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], total: 0, loading: false, page: 1, statusFilter: 'all', search: '' } as OrdersState,
  reducers: {
    setOrdersPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
    setOrdersStatus: (s, a: PayloadAction<string>) => { s.statusFilter = a.payload; s.page = 1; },
    setOrdersSearch: (s, a: PayloadAction<string>) => { s.search = a.payload; s.page = 1; },
  },
  extraReducers: b => {
    b.addCase(fetchOrders.pending, s => { s.loading = true; });
    b.addCase(fetchOrders.fulfilled, (s, a) => { s.items = a.payload.data; s.total = a.payload.total; s.loading = false; });
  },
});

// Notifications slice
interface NotificationsState {
  items: Notification[];
  loading: boolean;
}

export const fetchNotifications = createAsyncThunk('notifications/fetch', () => api.getNotifications());
export const markAllRead = createAsyncThunk('notifications/markAllRead', () => api.markAllNotificationsRead());

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], loading: false } as NotificationsState,
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchNotifications.fulfilled, (s, a) => { s.items = a.payload; });
    b.addCase(markAllRead.fulfilled, s => { s.items = s.items.map(n => ({ ...n, read: true })); });
  },
});

// Audit Logs slice
interface AuditLogsState {
  items: AuditLog[];
  total: number;
  loading: boolean;
  page: number;
}

export const fetchAuditLogs = createAsyncThunk('auditLogs/fetch', (params: { page: number; search?: string }) =>
  api.getAuditLogs(params.page, 20, params.search)
);

const auditLogsSlice = createSlice({
  name: 'auditLogs',
  initialState: { items: [], total: 0, loading: false, page: 1 } as AuditLogsState,
  reducers: {
    setAuditLogsPage: (s, a: PayloadAction<number>) => { s.page = a.payload; },
  },
  extraReducers: b => {
    b.addCase(fetchAuditLogs.pending, s => { s.loading = true; });
    b.addCase(fetchAuditLogs.fulfilled, (s, a) => { s.items = a.payload.data; s.total = a.payload.total; s.loading = false; });
  },
});

// Categories slice
interface CategoriesState {
  items: Category[];
  loading: boolean;
}

export const fetchCategories = createAsyncThunk('categories/fetch', () => api.getCategories());

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false } as CategoriesState,
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchCategories.pending, s => { s.loading = true; });
    b.addCase(fetchCategories.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; });
  },
});

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice.reducer,
    users: usersSlice.reducer,
    products: productsSlice.reducer,
    orders: ordersSlice.reducer,
    notifications: notificationsSlice.reducer,
    auditLogs: auditLogsSlice.reducer,
    categories: categoriesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const { setUsersPage, setUsersSearch } = usersSlice.actions;
export const { setProductsPage, setProductsSearch } = productsSlice.actions;
export const { setOrdersPage, setOrdersStatus, setOrdersSearch } = ordersSlice.actions;
export const { setAuditLogsPage } = auditLogsSlice.actions;
