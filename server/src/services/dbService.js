import mysql from 'mysql2/promise';

// Railway MySQL Configuration
const DB_CONFIG = {
  host: process.env.MYSQL_HOST || 'mysql.railway.internal',
  port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'magnula_db',
};

console.log(' Railway MySQL Configuration:');
console.log(`   Host: ${DB_CONFIG.host}`);
console.log(`   Port: ${DB_CONFIG.port}`);
console.log(`   User: ${DB_CONFIG.user}`);
console.log(`   Database: ${DB_CONFIG.database}`);

// Tạo connection pool tới Railway MySQL
const pool = mysql.createPool({
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  user: DB_CONFIG.user,
  password: DB_CONFIG.password,
  database: DB_CONFIG.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

// Database Service - Wraps MySQL2 operations
export const dbService = {
  // ===== COLLECTION OPERATIONS =====
  async getAllCollections() {
    const [rows] = await pool.query('SELECT * FROM Collection ORDER BY id DESC');
    return rows;
  },

  async getCollectionById(id) {
    const [rows] = await pool.query('SELECT * FROM Collection WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async getCollectionBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM Collection WHERE slug = ?', [slug]);
    return rows[0] || null;
  },

  async createCollection(data) {
    const { name, slug, images } = data;
    const [result] = await pool.query(
      'INSERT INTO Collection (name, slug, images) VALUES (?, ?, ?)',
      [name, slug, images]
    );
    return { id: result.insertId, name, slug, images };
  },

  async updateCollection(id, data) {
    const { name, slug, images } = data;
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (slug) {
      updates.push('slug = ?');
      values.push(slug);
    }
    if (images) {
      updates.push('images = ?');
      values.push(images);
    }

    if (updates.length === 0) return null;

    values.push(id);
    await pool.query(`UPDATE Collection SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.getCollectionById(id);
  },

  async deleteCollection(id) {
    await pool.query('DELETE FROM Collection WHERE id = ?', [id]);
    return true;
  },

  // ===== PRODUCT OPERATIONS =====
  async getAllProducts() {
    const [rows] = await pool.query(
      'SELECT * FROM Product ORDER BY id DESC'
    );
    return rows;
  },

  async getProductById(id) {
    const [rows] = await pool.query('SELECT * FROM Product WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async getProductsByCollection(collectionId) {
    const [rows] = await pool.query(
      'SELECT * FROM Product WHERE collectionId = ?',
      [collectionId]
    );
    return rows;
  },

  async createProduct(data) {
    const { name, slug, price, images, stock, collectionId, overallInfo, seatInfo } = data;
    const [result] = await pool.query(
      'INSERT INTO Product (name, slug, price, images, stock, collectionId, overallInfo, seatInfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, slug, price, images, stock || 10, collectionId || null, overallInfo || null, seatInfo || null]
    );
    return { id: result.insertId, ...data };
  },

  async updateProduct(id, data) {
    const { name, slug, price, images, stock, collectionId, overallInfo, seatInfo } = data;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (slug) { updates.push('slug = ?'); values.push(slug); }
    if (price) { updates.push('price = ?'); values.push(price); }
    if (images) { updates.push('images = ?'); values.push(images); }
    if (stock !== undefined) { updates.push('stock = ?'); values.push(stock); }
    if (collectionId) { updates.push('collectionId = ?'); values.push(collectionId); }
    if (overallInfo) { updates.push('overallInfo = ?'); values.push(overallInfo); }
    if (seatInfo) { updates.push('seatInfo = ?'); values.push(seatInfo); }

    if (updates.length === 0) return null;

    values.push(id);
    await pool.query(`UPDATE Product SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.getProductById(id);
  },

  async deleteProduct(id) {
    await pool.query('DELETE FROM Product WHERE id = ?', [id]);
    return true;
  },

  // ===== CUSTOMER OPERATIONS =====
  async getAllCustomers() {
    const [rows] = await pool.query('SELECT * FROM Customer ORDER BY id DESC');
    return rows;
  },

  async getCustomerById(id) {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async getCustomerByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM Customer WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async createCustomer(data) {
    const { firstname, lastname, email, phone, country, address, apartment, city, postalCode } = data;
    const [result] = await pool.query(
      'INSERT INTO Customer (firstname, lastname, email, phone, country, address, apartment, city, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firstname, lastname, email, phone, country, address, apartment || null, city, postalCode || null]
    );
    return { id: result.insertId, ...data };
  },

  async updateCustomer(id, data) {
    const { firstname, lastname, email, phone, country, address, apartment, city, postalCode } = data;
    const updates = [];
    const values = [];

    if (firstname) { updates.push('firstname = ?'); values.push(firstname); }
    if (lastname) { updates.push('lastname = ?'); values.push(lastname); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (country) { updates.push('country = ?'); values.push(country); }
    if (address) { updates.push('address = ?'); values.push(address); }
    if (apartment) { updates.push('apartment = ?'); values.push(apartment); }
    if (city) { updates.push('city = ?'); values.push(city); }
    if (postalCode) { updates.push('postalCode = ?'); values.push(postalCode); }

    if (updates.length === 0) return null;

    values.push(id);
    await pool.query(`UPDATE Customer SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.getCustomerById(id);
  },

  async deleteCustomer(id) {
    await pool.query('DELETE FROM Customer WHERE id = ?', [id]);
    return true;
  },

  async searchCustomer(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query(
      'SELECT * FROM Customer WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ?',
      [searchTerm, searchTerm, searchTerm]
    );
    return rows;
  },

  // ===== ORDER OPERATIONS =====
  async getAllOrders() {
    const [rows] = await pool.query(
      'SELECT * FROM `Order` ORDER BY createdAt DESC'
    );
    return rows;
  },

  async getOrderById(id) {
    const [rows] = await pool.query('SELECT * FROM `Order` WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async getOrdersByCustomerId(customerId) {
    const [rows] = await pool.query(
      'SELECT * FROM `Order` WHERE customerId = ? ORDER BY createdAt DESC',
      [customerId]
    );
    return rows;
  },

  async getOrdersByStatus(status) {
    const [rows] = await pool.query(
      'SELECT * FROM `Order` WHERE status = ? ORDER BY createdAt DESC',
      [status]
    );
    return rows;
  },

  async createOrder(data) {
    const { customerId, shippingFee, totalPrice, status, paymentMethod } = data;
    const [result] = await pool.query(
      'INSERT INTO `Order` (customerId, shippingFee, totalPrice, status, paymentMethod, createdAt) VALUES (?, ?, ?, ?, ?, NOW())',
      [customerId, shippingFee || 0, totalPrice, status || 'pending', paymentMethod]
    );
    return { id: result.insertId, ...data };
  },

  async updateOrderStatus(id, status) {
    await pool.query('UPDATE `Order` SET status = ? WHERE id = ?', [status, id]);
    return this.getOrderById(id);
  },

  async deleteOrder(id) {
    await pool.query('DELETE FROM `Order` WHERE id = ?', [id]);
    return true;
  },

  // ===== ORDER ITEM OPERATIONS =====
  async getOrderItems(orderId) {
    const [rows] = await pool.query(
      'SELECT * FROM OrderItem WHERE orderId = ?',
      [orderId]
    );
    return rows;
  },

  async createOrderItem(data) {
    const { orderId, productId, quantity, price, selectedOverall, selectedSeat } = data;
    const [result] = await pool.query(
      'INSERT INTO OrderItem (orderId, productId, quantity, price, selectedOverall, selectedSeat) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, productId || null, quantity, price, selectedOverall || null, selectedSeat || null]
    );
    return { id: result.insertId, ...data };
  },

  // ===== UTILITY =====
  async testConnection() {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      return { success: true, message: 'Connected to Aiven MySQL' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default dbService;
