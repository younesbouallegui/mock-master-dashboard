export const en = {
  app: { name: 'FB Admin', tagline: 'Enterprise Operations Platform' },
  nav: {
    dashboard: 'Dashboard', users: 'Users', products: 'Products', orders: 'Orders',
    categories: 'Categories', notifications: 'Notifications', auditLogs: 'Audit Logs',
    settings: 'Settings', analytics: 'Analytics',
  },
  auth: {
    signIn: 'Sign In', signOut: 'Sign Out', email: 'Email Address', password: 'Password',
    rememberMe: 'Remember me', forgotPassword: 'Forgot password?', login: 'Sign In',
    loginSubtitle: 'Enter your credentials to access the platform',
    forgotTitle: 'Reset Password', forgotSubtitle: 'Enter your email to receive a reset link',
    sendReset: 'Send Reset Link', backToLogin: 'Back to Sign In',
    resetTitle: 'Set New Password', resetSubtitle: 'Enter your new password below',
    resetButton: 'Reset Password', resetSuccess: 'Password reset successfully',
    forgotSuccess: 'Reset link sent to your email',
    invalidCredentials: 'Invalid email or password',
    newPassword: 'New Password', confirmPassword: 'Confirm Password',
  },
  dashboard: {
    title: 'Dashboard', totalRevenue: 'Total Revenue', totalOrders: 'Total Orders',
    totalUsers: 'Total Users', totalProducts: 'Total Products', revenueChart: 'Revenue Trend',
    ordersByStatus: 'Orders by Status', visitors: 'Visitors', recentOrders: 'Recent Orders',
    topProducts: 'Top Products', conversionRate: 'Conversion Rate', avgOrderValue: 'Avg Order Value',
    salesGrowth: 'Sales Growth', refundRate: 'Refund Rate', revenueByRegion: 'Revenue by Region',
    last30Days: 'Last 30 days', last7Days: 'Last 7 days', last90Days: 'Last 90 days',
  },
  users: {
    title: 'Users', search: 'Search users...', addUser: 'Add User', editUser: 'Edit User',
    name: 'Name', email: 'Email', role: 'Role', department: 'Department', status: 'Status',
    actions: 'Actions', deleteConfirm: 'Are you sure you want to delete this user?',
  },
  products: {
    title: 'Products', search: 'Search products...', addProduct: 'Add Product',
    editProduct: 'Edit Product', name: 'Name', sku: 'SKU', price: 'Price', stock: 'Stock',
    rating: 'Rating', status: 'Status', category: 'Category', description: 'Description',
    deleteConfirm: 'Are you sure you want to delete this product?',
    lowStockAlert: 'Low Stock Alert', outOfStock: 'Out of Stock',
  },
  orders: {
    title: 'Orders', search: 'Search orders...', orderId: 'Order ID', customer: 'Customer',
    status: 'Status', payment: 'Payment', total: 'Total', date: 'Date',
    all: 'All', pending: 'Pending', processing: 'Processing', shipped: 'Shipped',
    delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded',
    orderDetails: 'Order Details', timeline: 'Timeline', updateStatus: 'Update Status',
  },
  settings: {
    title: 'Settings', general: 'General', appearance: 'Appearance', security: 'Security',
    notifications: 'Notifications', branding: 'Branding', language: 'Language',
    theme: 'Theme', dark: 'Dark', light: 'Light', system: 'System',
    companyName: 'Company Name', companyLogo: 'Company Logo', timezone: 'Timezone',
    currency: 'Currency', save: 'Save Changes', saved: 'Settings saved successfully',
  },
  common: {
    save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add',
    search: 'Search...', noResults: 'No results found', loading: 'Loading...',
    confirm: 'Confirm', yes: 'Yes', no: 'No', close: 'Close', actions: 'Actions',
    export: 'Export', import: 'Import', filter: 'Filter', refresh: 'Refresh',
    viewAll: 'View All', back: 'Back', next: 'Next', previous: 'Previous',
  },
};

export type TranslationKeys = typeof en;
