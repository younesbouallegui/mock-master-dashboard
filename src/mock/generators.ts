import type { User, Category, Product, Order, OrderItem, Metric, Notification, AuditLog } from './types';

const uid = (prefix: string, i: number) => `${prefix}-${String(i).padStart(4, '0')}`;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, dec = 2) => +(Math.random() * (max - min) + min).toFixed(dec);
const pastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(rand(0, 23), rand(0, 59), rand(0, 59));
  return d.toISOString();
};

const firstNames = ['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Elizabeth','William','Barbara','Richard','Susan','Joseph','Jessica','Thomas','Sarah','Christopher','Karen','Charles','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret','Mark','Sandra'];
const lastNames = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson'];
const departments = ['Engineering','Marketing','Sales','Support','Operations','Finance','HR','Product','Design','Legal'];
const streets = ['Oak St','Maple Ave','Pine Rd','Cedar Ln','Elm Blvd','Birch Way','Walnut Dr','Spruce Ct','Willow Pl','Cherry Cir'];
const cities = ['New York','Los Angeles','Chicago','Houston','Phoenix','Philadelphia','San Antonio','San Diego','Dallas','Austin'];

export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    return {
      id: uid('usr', i + 1),
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
      role: pick(['admin', 'manager', 'editor', 'viewer'] as const),
      status: pick(['active', 'active', 'active', 'inactive', 'suspended'] as const),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fn}${i}`,
      phone: `+1-${rand(200, 999)}-${rand(100, 999)}-${rand(1000, 9999)}`,
      department: pick(departments),
      joinedAt: pastDate(rand(30, 700)),
      lastLogin: pastDate(rand(0, 30)),
    };
  });
}

const categoryData: { name: string; subs: string[] }[] = [
  { name: 'Electronics', subs: ['Smartphones', 'Laptops', 'Tablets', 'Accessories'] },
  { name: 'Clothing', subs: ['Men\'s Wear', 'Women\'s Wear', 'Kids', 'Sportswear'] },
  { name: 'Home & Garden', subs: ['Furniture', 'Kitchen', 'Decor', 'Garden Tools'] },
  { name: 'Sports', subs: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports'] },
  { name: 'Books', subs: ['Fiction', 'Non-Fiction', 'Educational', 'Comics'] },
  { name: 'Food & Beverages', subs: ['Snacks', 'Drinks', 'Organic', 'Gourmet'] },
];

export function generateCategories(): Category[] {
  const cats: Category[] = [];
  let idx = 1;
  for (const c of categoryData) {
    const parentId = uid('cat', idx);
    cats.push({ id: parentId, name: c.name, slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), parentId: null, description: `All ${c.name} products`, productCount: 0 });
    idx++;
    for (const s of c.subs) {
      cats.push({ id: uid('cat', idx), name: s, slug: s.toLowerCase().replace(/[^a-z0-9]+/g, '-'), parentId, description: `${s} in ${c.name}`, productCount: 0 });
      idx++;
    }
  }
  return cats;
}

const adjectives = ['Premium','Classic','Ultra','Pro','Elite','Slim','Max','Eco','Smart','Turbo'];
const nouns = ['Widget','Gadget','Device','Tool','Kit','Set','Pack','Bundle','System','Unit'];

export function generateProducts(count: number, categories: Category[]): Product[] {
  const subcats = categories.filter(c => c.parentId !== null);
  return Array.from({ length: count }, (_, i) => {
    const cat = subcats[i % subcats.length];
    return {
      id: uid('prd', i + 1),
      name: `${pick(adjectives)} ${pick(nouns)} ${i + 1}`,
      sku: `SKU-${String(i + 1).padStart(5, '0')}`,
      categoryId: cat.id,
      price: randFloat(9.99, 999.99),
      stock: rand(0, 500),
      status: pick(['active', 'active', 'active', 'draft', 'archived'] as const),
      image: `https://picsum.photos/seed/prod${i}/200/200`,
      description: `High quality ${cat.name} product with excellent features and durability.`,
      rating: randFloat(1, 5, 1),
      createdAt: pastDate(rand(10, 400)),
    };
  });
}

export function generateOrders(count: number, users: User[]): Order[] {
  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled', 'refunded'];
  const payments: Order['paymentMethod'][] = ['credit_card', 'credit_card', 'paypal', 'bank_transfer', 'crypto'];
  return Array.from({ length: count }, (_, i) => {
    const subtotal = randFloat(19.99, 2499.99);
    const tax = +(subtotal * 0.08).toFixed(2);
    const shipping = subtotal > 100 ? 0 : randFloat(4.99, 14.99);
    return {
      id: uid('ord', i + 1),
      userId: pick(users).id,
      status: pick(statuses),
      subtotal,
      tax,
      shipping,
      total: +(subtotal + tax + shipping).toFixed(2),
      paymentMethod: pick(payments),
      shippingAddress: `${rand(100, 9999)} ${pick(streets)}, ${pick(cities)}`,
      createdAt: pastDate(rand(0, 540)),
      updatedAt: pastDate(rand(0, 30)),
    };
  });
}

export function generateOrderItems(orders: Order[], products: Product[]): OrderItem[] {
  const items: OrderItem[] = [];
  let idx = 1;
  for (const order of orders) {
    const itemCount = rand(1, 5);
    for (let j = 0; j < itemCount; j++) {
      const product = pick(products);
      const qty = rand(1, 4);
      items.push({
        id: uid('oi', idx),
        orderId: order.id,
        productId: product.id,
        quantity: qty,
        price: product.price,
        total: +(product.price * qty).toFixed(2),
      });
      idx++;
    }
  }
  return items;
}

export function generateMetrics(months: number): Metric[] {
  const metrics: Metric[] = [];
  const now = new Date();
  for (let m = months - 1; m >= 0; m--) {
    const daysInMonth = 30;
    for (let d = 0; d < daysInMonth; d++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - m);
      date.setDate(d + 1);
      if (date > now) break;
      const base = 1000 + m * 50;
      metrics.push({
        date: date.toISOString().split('T')[0],
        revenue: randFloat(base * 2, base * 8),
        orders: rand(10, 80),
        visitors: rand(500, 5000),
        conversion: randFloat(1.5, 8.5),
        newUsers: rand(5, 60),
      });
    }
  }
  return metrics;
}

const notifTemplates = [
  { type: 'info' as const, title: 'New user registered', message: 'A new user has signed up for the platform.' },
  { type: 'warning' as const, title: 'Low stock alert', message: 'Product stock is below threshold.' },
  { type: 'error' as const, title: 'Payment failed', message: 'A payment transaction has failed.' },
  { type: 'success' as const, title: 'Order completed', message: 'Order has been successfully delivered.' },
  { type: 'info' as const, title: 'System update', message: 'System maintenance scheduled for tonight.' },
  { type: 'warning' as const, title: 'High traffic detected', message: 'Unusual traffic spike detected on the platform.' },
];

export function generateNotifications(count: number): Notification[] {
  return Array.from({ length: count }, (_, i) => {
    const t = pick(notifTemplates);
    return {
      id: uid('ntf', i + 1),
      type: t.type,
      title: t.title,
      message: t.message,
      read: Math.random() > 0.4,
      createdAt: pastDate(rand(0, 60)),
    };
  });
}

const actions = ['created', 'updated', 'deleted', 'viewed', 'exported', 'imported'];
const resources = ['user', 'product', 'order', 'category', 'settings', 'report'];

export function generateAuditLogs(count: number, users: User[]): AuditLog[] {
  return Array.from({ length: count }, (_, i) => {
    const action = pick(actions);
    const resource = pick(resources);
    return {
      id: uid('log', i + 1),
      userId: pick(users).id,
      action,
      resource,
      resourceId: uid(resource.slice(0, 3), rand(1, 100)),
      details: `${action} ${resource} record`,
      ip: `${rand(10, 220)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`,
      createdAt: pastDate(rand(0, 90)),
    };
  });
}
