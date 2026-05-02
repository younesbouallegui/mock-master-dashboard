import { MockDB } from './db';
import { generateUsers, generateCategories, generateProducts, generateOrders, generateOrderItems, generateMetrics, generateNotifications, generateAuditLogs } from './generators';
import type { User, Category, Product, Order, OrderItem, Metric, Notification, AuditLog } from './types';

// Generate all seed data
const users = generateUsers(30);
const categories = generateCategories();
const products = generateProducts(120, categories);
const orders = generateOrders(300, users);
const orderItems = generateOrderItems(orders, products);
const metrics = generateMetrics(18);
const notifications = generateNotifications(50);
const auditLogs = generateAuditLogs(200, users);

// Create DB instances
export const usersDB = new MockDB<User>(users);
export const categoriesDB = new MockDB<Category>(categories);
export const productsDB = new MockDB<Product>(products);
export const ordersDB = new MockDB<Order>(orders);
export const orderItemsDB = new MockDB<OrderItem>(orderItems);
export const metricsDB = new MockDB<Metric>(metrics);
export const notificationsDB = new MockDB<Notification>(notifications);
export const auditLogsDB = new MockDB<AuditLog>(auditLogs);

// Simulate async delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const api = {
  // Users
  async getUsers(page = 1, limit = 10, search?: string) {
    await delay();
    let data = search ? usersDB.search(search, ['name', 'email', 'department']) : usersDB.findAll();
    const total = data.length;
    const start = (page - 1) * limit;
    return { data: data.slice(start, start + limit), total, page, limit };
  },
  async getUserById(id: string) { await delay(); return usersDB.findById(id); },
  async createUser(user: User) { await delay(); return usersDB.create(user); },
  async updateUser(id: string, updates: Partial<User>) { await delay(); return usersDB.update(id, updates); },
  async deleteUser(id: string) { await delay(); return usersDB.delete(id); },

  // Products
  async getProducts(page = 1, limit = 10, search?: string, categoryId?: string) {
    await delay();
    let data = productsDB.findAll();
    if (search) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
    if (categoryId) data = data.filter(p => p.categoryId === categoryId);
    const total = data.length;
    const start = (page - 1) * limit;
    return { data: data.slice(start, start + limit), total, page, limit };
  },
  async getProductById(id: string) { await delay(); return productsDB.findById(id); },
  async createProduct(product: Product) { await delay(); return productsDB.create(product); },
  async updateProduct(id: string, updates: Partial<Product>) { await delay(); return productsDB.update(id, updates); },
  async deleteProduct(id: string) { await delay(); return productsDB.delete(id); },

  // Categories
  async getCategories() { await delay(); return categoriesDB.findAll(); },
  async createCategory(cat: Category) { await delay(); return categoriesDB.create(cat); },
  async updateCategory(id: string, updates: Partial<Category>) { await delay(); return categoriesDB.update(id, updates); },
  async deleteCategory(id: string) { await delay(); return categoriesDB.delete(id); },

  // Orders
  async getOrders(page = 1, limit = 10, status?: string, search?: string) {
    await delay();
    let data = ordersDB.findAll();
    if (status && status !== 'all') data = data.filter(o => o.status === status);
    if (search) data = data.filter(o => o.id.toLowerCase().includes(search.toLowerCase()));
    const total = data.length;
    const start = (page - 1) * limit;
    return { data: data.slice(start, start + limit), total, page, limit };
  },
  async getOrderById(id: string) { await delay(); return ordersDB.findById(id); },
  async getOrderItems(orderId: string) { await delay(); return orderItemsDB.filter(oi => oi.orderId === orderId); },
  async updateOrder(id: string, updates: Partial<Order>) { await delay(); return ordersDB.update(id, updates); },

  // Metrics
  async getMetrics(startDate?: string, endDate?: string) {
    await delay();
    let data = metricsDB.findAll();
    if (startDate) data = data.filter(m => m.date >= startDate);
    if (endDate) data = data.filter(m => m.date <= endDate);
    return data;
  },

  async getDashboardStats() {
    await delay();
    const allOrders = ordersDB.findAll();
    const allUsers = usersDB.findAll();
    const allProducts = productsDB.findAll();
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
    const today = new Date().toISOString().split('T')[0];
    const last30 = new Date(); last30.setDate(last30.getDate() - 30);
    const recentOrders = allOrders.filter(o => o.createdAt >= last30.toISOString());

    return {
      totalRevenue: +totalRevenue.toFixed(2),
      totalOrders: allOrders.length,
      totalUsers: allUsers.length,
      totalProducts: allProducts.length,
      recentOrdersCount: recentOrders.length,
      recentRevenue: +recentOrders.reduce((s, o) => s + o.total, 0).toFixed(2),
      ordersByStatus: {
        pending: allOrders.filter(o => o.status === 'pending').length,
        processing: allOrders.filter(o => o.status === 'processing').length,
        shipped: allOrders.filter(o => o.status === 'shipped').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length,
        refunded: allOrders.filter(o => o.status === 'refunded').length,
      },
      topProducts: allProducts.slice(0, 5).map(p => ({ name: p.name, revenue: +(p.price * (p.stock > 0 ? p.stock : 1)).toFixed(2) })),
    };
  },

  // Notifications
  async getNotifications() { await delay(); return notificationsDB.findAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
  async markNotificationRead(id: string) { await delay(); return notificationsDB.update(id, { read: true }); },
  async markAllNotificationsRead() {
    await delay();
    notificationsDB.findAll().forEach(n => notificationsDB.update(n.id, { read: true }));
  },

  // Audit Logs
  async getAuditLogs(page = 1, limit = 20, search?: string) {
    await delay();
    let data = auditLogsDB.findAll().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (search) data = data.filter(l => l.action.includes(search) || l.resource.includes(search) || l.details.toLowerCase().includes(search.toLowerCase()));
    const total = data.length;
    const start = (page - 1) * limit;
    return { data: data.slice(start, start + limit), total, page, limit };
  },
};
