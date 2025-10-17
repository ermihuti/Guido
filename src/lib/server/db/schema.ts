import {
  mysqlTable,
  int,
  bigint,
  varchar,
  decimal,
  text,
  boolean,
  timestamp,
  tinyint,
  mysqlEnum,
  primaryKey
} from 'drizzle-orm/mysql-core';

// ------------------- 1) Users -------------------
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  role: mysqlEnum('role', ['client','courier','shop','admin']).notNull().default('client'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ------------------- 2) Addresses -------------------
export const addresses = mysqlTable('addresses', {
  id: int('id').autoincrement().primaryKey(),
  user_id: int('user_id').notNull().references(() => users.id),
  street: varchar('street', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  postal_code: varchar('postal_code', { length: 20 }),
  country: varchar('country', { length: 100 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),
  is_default: boolean('is_default').default(false)
});

// ------------------- 3) Payment Methods -------------------
export const payment_methods = mysqlTable('payment_methods', {
  id: int('id').autoincrement().primaryKey(),
  user_id: int('user_id').notNull().references(() => users.id),
  type: mysqlEnum('type', ['credit_card','online','cash']).notNull().default('cash'),
  provider: varchar('provider', { length: 100 }),
  provider_token: varchar('provider_token', { length: 255 }),
  last4: varchar('last4', { length: 4 }),
  expiry_date: timestamp('expiry_date'),
  is_default: boolean('is_default').default(false)
});

// ------------------- 4) Shops -------------------
export const shops = mysqlTable('shops', {
  id: int('id').autoincrement().primaryKey(),
  owner_id: int('owner_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  category: mysqlEnum('category', ['restaurant','grocery','electronics']),
  description: text('description'),
  address: varchar('address', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  rating: decimal('rating', { precision: 3, scale: 2 }),
  created_at: timestamp('created_at').defaultNow(),
});

// ------------------- 5) Categories -------------------
export const categories = mysqlTable('categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
});

// ------------------- 6) Shops <-> Categories (M:N) -------------------
export const shops_categories = mysqlTable(
  'shops_categories',
  {
    shop_id: int('shop_id').notNull().references(() => shops.id),
    category_id: int('category_id').notNull().references(() => categories.id),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.shop_id, table.category_id),
  })
);

// ------------------- 7) Products -------------------
export const products = mysqlTable('products', {
  id: int('id').autoincrement().primaryKey(),
  shop_id: int('shop_id').notNull().references(() => shops.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  image_url: text('image_url'),
  stock_quantity: int('stock_quantity').default(0),
  is_available: boolean('is_available').default(true),
  created_at: timestamp('created_at').defaultNow(),
});

// ------------------- 9) Orders -------------------
export const orders = mysqlTable('orders', {
  id: int('id').autoincrement().primaryKey(),
  user_id: int('user_id').notNull().references(() => users.id),
  shop_id: int('shop_id').references(() => shops.id),
  courier_id: int('courier_id').references(() => users.id),
  status: mysqlEnum('status', ['pending','accepted','preparing','on_the_way','delivered','canceled']).notNull().default('pending'),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).default('0.00'),
  delivery_address_id: int('delivery_address_id').references(() => addresses.id),
  payment_method_id: int('payment_method_id').references(() => payment_methods.id),
  scheduled_time: timestamp('scheduled_time'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ------------------- 10) Order Items -------------------
export const order_items = mysqlTable('order_items', {
  id: int('id').autoincrement().primaryKey(),
  order_id: int('order_id').notNull().references(() => orders.id),
  product_id: int('product_id').references(() => products.id),
  quantity: int('quantity').notNull().default(1),
  unit_price: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// ------------------- 12) Deliveries -------------------
export const deliveries = mysqlTable('deliveries', {
  id: int('id').autoincrement().primaryKey(),
  order_id: int('order_id').notNull().references(() => orders.id),
  courier_id: int('courier_id').references(() => users.id),
  status: mysqlEnum('status', ['assigned','picked_up','on_the_way','delivered']).default('assigned'),
  pickup_time: timestamp('pickup_time'),
  delivered_time: timestamp('delivered_time'),
  tracking_link: varchar('tracking_link', { length: 512 }),
  created_at: timestamp('created_at').defaultNow(),
});

// ------------------- 13) Courier Locations -------------------
export const courier_locations = mysqlTable('courier_locations', {
  id: bigint("id", { mode: "bigint" }).autoincrement().primaryKey(),
  courier_id: int('courier_id').notNull().references(() => users.id),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  speed: decimal('speed', { precision: 6, scale: 2 }),
  heading: decimal('heading', { precision: 6, scale: 2 }),
  anomaly_flag: boolean('anomaly_flag').default(false),
  received_at: timestamp('received_at').defaultNow(),
  timestamp: timestamp('timestamp'),
  eta: timestamp('eta'),
});

// ------------------- 14) Favourites -------------------
export const favourites = mysqlTable(
  'favourites',
  {
    user_id: int('user_id').notNull().references(() => users.id),
    shop_id: int('shop_id').notNull().references(() => shops.id),
    created_at: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.user_id, table.shop_id),
  })
);

// ------------------- 15) Ratings -------------------
export const ratings = mysqlTable('ratings', {
  id: int('id').autoincrement().primaryKey(),
  user_id: int('user_id').notNull().references(() => users.id),
  shop_id: int('shop_id').notNull().references(() => shops.id),
  order_id: int('order_id').references(() => orders.id),
  score: tinyint('score').notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow(),
});

// ------------------- 16) Admin Logs -------------------
export const admin_logs = mysqlTable('admin_logs', {
  id: bigint("id", { mode: "bigint" }).autoincrement().primaryKey(),
  admin_id: int('admin_id').references(() => users.id),
  action: text('action').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// ------------------- 17) Statistics -------------------
export const statistics = mysqlTable('statistics', {
  id: int('id').autoincrement().primaryKey(),
  shop_id: int('shop_id').notNull().references(() => shops.id),
  orders_count: int('orders_count').default(0),
  total_revenue: decimal('total_revenue', { precision: 15, scale: 2 }).default('0.00'),
  popular_products: text('popular_products'),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ===== 18) Session Table (for Lucia) =====
export const session = mysqlTable('session', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: int('user_id').notNull().references(() => users.id),
  expires_at: timestamp('expires_at').notNull(),
});