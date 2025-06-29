const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');  // Pastikan baris ini ada!
const path = require('path');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_fitmart'
});

// Get all categories
app.get('/api/categories', (req, res) => {
  const sql = 'SELECT * FROM categories';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Get all products (with category name)
app.get('/api/products', (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Register
// Di backend: POST /api/register
app.post('/api/register', (req, res) => {
  const {
    username, password, email,
    date_of_birth, gender, address,
    city, contact_no
  } = req.body;

  const sql = `INSERT INTO users 
    (username, password, email, date_of_birth, gender, address, city, contact_no, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    username, password, email, date_of_birth, gender, address, city, contact_no, 'customer'
  ], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Gagal registrasi' });
    }
    res.json({ success: true, message: 'Registrasi berhasil' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Server error' });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Email tidak ditemukan' });
    }

    const user = results[0];

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Password salah' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// GET semua kategori
app.get('/api/categories', (req, res) => {
  const sql = 'SELECT * FROM categories';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// POST kategori baru
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  const sql = 'INSERT INTO categories (name, description) VALUES (?, ?)';
  db.query(sql, [name, description], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId });
  });
});

// PUT (update) kategori
app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const sql = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
  db.query(sql, [name, description, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// DELETE kategori
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM categories WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../src/assets/');  // Simpan gambar di folder src/assets
  },
  filename: (req, file, cb) => {
    const productName = req.body.name || 'produk'; // fallback jika tidak ada nama
    // Ganti spasi dan karakter khusus, lalu tambahkan ekstensi asli
    const safeName = productName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const fileName = `${safeName}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }  
});

const upload = multer({ storage: storage });

app.get('/api/produk', (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    res.json(result[0]); // karena hanya satu produk yang dicari
  });
});

// POST Menambah products (dengan upload gambar)
app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image_url = req.file ? req.file.filename : null;

  const sql = 'INSERT INTO products (name, price, description, image_url, category_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, price, description, image_url, category_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'products berhasil ditambahkan', id: result.insertId });
  });
});

// PUT Update products (dengan upload gambar)
app.put('/api/products/:id', upload.single('image'), (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image_url = req.file ? req.file.filename : req.body.existingImage;

  const sql = 'UPDATE products SET name = ?, price = ?, description = ?, image_url = ?, category_id = ? WHERE id = ?';
  db.query(sql, [name, price, description, image_url, category_id, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'products berhasil diupdate' });
  });
});

// DELETE products
app.delete('/api/products/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'products berhasil dihapus' });
  });
});

// GET semua user (tampilkan semua kolom)
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// POST tambah user (hanya untuk admin/seller)
app.post('/api/users', (req, res) => {
  const {
    username,
    email,
    password,
    date_of_birth,
    gender,
    address,
    city,
    contact_no,
    role
  } = req.body;

  if (!['admin', 'seller'].includes(role)) {
    return res.status(400).json({ error: 'Role tidak valid' });
  }

  const sql = `INSERT INTO users 
    (username, email, password, date_of_birth, gender, address, city, contact_no, role) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [username, email, password, date_of_birth, gender, address, city, contact_no, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User ditambahkan', id: result.insertId });
    }
  );
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const {
    username,
    email,
    password,
    date_of_birth,
    gender,
    address,
    city,
    contact_no,
    role
  } = req.body;

  const { id } = req.params;

  const sql = `UPDATE users SET 
    username = ?,
    email = ?,
    password = ?,
    date_of_birth = ?,
    gender = ?,
    address = ?,
    city = ?,
    contact_no = ?,
    role = ?
    WHERE id = ?`;

  db.query(
    sql,
    [username, email, password, date_of_birth, gender, address, city, contact_no, role, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User diperbarui', id });
    }
  );
});

// DELETE user (kecuali username = 'admin')
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  const checkSql = 'SELECT username FROM users WHERE id = ?';
  db.query(checkSql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User tidak ditemukan' });

    const username = results[0].username;
    if (username.toLowerCase() === 'admin') {
      return res.status(403).json({ error: 'User dengan nama "admin" tidak boleh dihapus' });
    }

    const deleteSql = 'DELETE FROM users WHERE id = ?';
    db.query(deleteSql, [userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User berhasil dihapus' });
    });
  });
});

// Guest book entries
// GET semua entri guestbook
app.get('/api/guestbook', (req, res) => {
  db.query('SELECT * FROM guestbook ORDER BY created_at DESC', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// POST entri baru
app.post('/api/guestbook', (req, res) => {
  const { name, message } = req.body;
  const sql = 'INSERT INTO guestbook (name, message) VALUES (?, ?)';
  db.query(sql, [name, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Entri ditambahkan' });
  });
});

// DELETE entri guest book
app.delete('/api/guestbook/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM guestbook WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Entri berhasil dihapus.' });
  });
});

// GET cart items for user
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `
  SELECT
  cart.id, products.name, products.price, products.image_url,
  products.category_id, cart.quantity,
  categories.name AS category_name 
FROM cart 
JOIN products ON cart.product_id = products.id
JOIN categories ON products.category_id = categories.id 
WHERE cart.user_id = ? AND cart.is_checked_out = 0;
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result); // Mengirimkan data dalam bentuk array JSON
  });
});

// Post Cart
app.post('/api/cart', (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  // Pastikan data yang diperlukan ada
  if (!user_id || !product_id || !quantity) {
    return res.status(400).send({ error: 'Missing required fields' });
  }

  // Cek apakah produk sudah ada dalam keranjang
  const sqlCheck = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND is_checked_out = 0';
  db.query(sqlCheck, [user_id, product_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'Database error' });
    }

    if (result.length > 0) {
      // Jika produk sudah ada, update quantity
      const sqlUpdate = 'UPDATE cart SET quantity = quantity + ? WHERE id = ? AND is_checked_out = 0';
      db.query(sqlUpdate, [quantity, result[0].id], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: 'Failed to update cart' });
        }
        res.status(200).send({ message: 'Quantity updated successfully' });
      });
    } else {
      // Jika produk belum ada, masukkan produk baru ke keranjang
      const sqlInsert = 'INSERT INTO cart (user_id, product_id, quantity, is_checked_out) VALUES (?, ?, ?, 0)';
      db.query(sqlInsert, [user_id, product_id, quantity], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: 'Failed to add product to cart' });
        }
        res.status(200).send({ message: 'Product added to cart successfully' });
      });
    }
  });
});

// UPDATE quantity
app.put('/api/cart/:id', (req, res) => {
  const { quantity } = req.body;
  db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

// DELETE item
app.delete('/api/cart/:id', (req, res) => {
  db.query('DELETE FROM cart WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

// CHECKOUT
app.post('/api/checkout', (req, res) => {
  const { user_id, payment_method } = req.body;

  const getCart = `SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ? AND c.is_checked_out = 0`;
  db.query(getCart, [user_id], (err, cart) => {
    if (err) return res.status(500).send(err);
    if (cart.length === 0) return res.status(400).send('Cart kosong');

    const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const insertOrder = 'INSERT INTO orders (user_id, total_price, status, payment_method) VALUES (?, ?, "packaging", ?)';
    
    db.query(insertOrder, [user_id, total, payment_method], (err, result) => {
      if (err) return res.status(500).send(err);
      const orderId = result.insertId;

      const items = cart.map(item => [orderId, item.product_id, item.quantity, item.price]);
      const insertItems = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';

      db.query(insertItems, [items], (err) => {
        if (err) return res.status(500).send(err);

        // Update cart items to mark as checked out
        const updateCart = 'UPDATE cart SET is_checked_out = 1 WHERE user_id = ? AND is_checked_out = 0';
        db.query(updateCart, [user_id], (err) => {
          if (err) return res.status(500).send(err);
          res.sendStatus(200);
        });
      });
    });
  });
});

//order customer
app.get('/api/orders/user/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM orders WHERE user_id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.get('/api/orders/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT o.id AS order_id, o.status, o.total_price, o.payment_method, o.created_at,
           oi.product_id, p.name, p.image_url, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    
    // Gabungkan order_items ke dalam setiap order
    const orders = [];
    const orderMap = {};

    results.forEach(row => {
      if (!orderMap[row.order_id]) {
        orderMap[row.order_id] = {
          order_id: row.order_id,
          status: row.status,
          total_price: row.total_price,
          payment_method: row.payment_method,
          created_at: row.created_at,
          items: []
        };
        orders.push(orderMap[row.order_id]);
      }
      orderMap[row.order_id].items.push({
        product_id: row.product_id,
        name: row.name,
        image_url: row.image_url,
        quantity: row.quantity,
        price: row.price
      });
    });

    res.json(orders);
  });
});

app.put('/api/orders/:orderId/complete', (req, res) => {
  const { orderId } = req.params;
  const sql = 'UPDATE orders SET status = "completed" WHERE id = ?';
  db.query(sql, [orderId], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.put('/api/orders/:orderId/cancel', (req, res) => {
  const { orderId } = req.params;

  const checkSql = 'SELECT status FROM orders WHERE id = ?';
  db.query(checkSql, [orderId], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Order tidak ditemukan');

    const currentStatus = results[0].status;
    if (currentStatus === 'shipped' || currentStatus === 'completed') {
      return res.status(400).send('Pesanan tidak dapat dibatalkan pada status ini');
    }

    const updateSql = 'UPDATE orders SET status = "cancelled" WHERE id = ?';
    db.query(updateSql, [orderId], (err) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    });
  });
});

//update status order admin
app.patch('/api/orders/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, orderId], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.put('/api/orders/:id/ship', (req, res) => {
  const orderId = req.params.id;
  const updateStatus = 'UPDATE orders SET status = "shipped" WHERE id = ?';
  db.query(updateStatus, [orderId], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.get('/api/ordersAdmin', (req, res) => {
  const query = `
    SELECT 
      o.id AS order_id, o.user_id, o.total_price, o.status, o.payment_method, o.created_at,
      u.username,
      oi.product_id, oi.quantity, oi.price,
      p.name AS product_name, p.image_url
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ORDER BY o.id DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);

    // Struktur hasil ke dalam array per order
    const orders = {};
    results.forEach(row => {
      if (!orders[row.order_id]) {
        orders[row.order_id] = {
          id: row.order_id,
          user: {
            id: row.user_id,
            username: row.username
          },
          total_price: row.total_price,
          status: row.status,
          payment_method: row.payment_method,
          created_at: row.created_at,
          items: []
        };
      }

      orders[row.order_id].items.push({
        product_id: row.product_id,
        quantity: row.quantity,
        price: row.price,
        product: {
          name: row.product_name,
          image_url: row.image_url
        }
      });
    });

    res.json(Object.values(orders));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
