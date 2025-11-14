const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const multer = require('multer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// 🟩 Setup Multer for user image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'public/uploads/users';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + ext;
    cb(null, unique);
  }
});

const upload = multer({ storage });


// 🟩 Get all users
router.get('/', (req, res) => {
  const draw = req.query.draw;
  const start = parseInt(req.query.start) || 0;
  const length = parseInt(req.query.length) || 10;
  const search = req.query['search[value]'] || '';

  let whereClause = '';
  if (search) {
    whereClause = `WHERE name LIKE '%${search}%' OR email LIKE '%${search}%' OR city LIKE '%${search}%'`;
  }

  // Count total users
  const totalQuery = `SELECT COUNT(*) AS total FROM users`;
  const filteredQuery = `SELECT COUNT(*) AS total FROM users ${whereClause}`;
  const dataQuery = `SELECT * FROM users ${whereClause} LIMIT ${length} OFFSET ${start}`;

  db.query(totalQuery, (err, totalResult) => {
    if (err) return res.status(500).json({ error: err.message });

    const recordsTotal = totalResult[0].total;

    db.query(filteredQuery, (err, filteredResult) => {
      if (err) return res.status(500).json({ error: err.message });

      const recordsFiltered = filteredResult[0].total;

      db.query(dataQuery, (err, dataResult) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          draw: parseInt(draw),
          recordsTotal,
          recordsFiltered,
          data: dataResult
        });
      });
    });
  });
});

// 🟦 Get user by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

// 🟨 Create new user (✅ supports image upload + duplicate email check)
router.post('/', upload.single('image'), (req, res) => {
  const { name, email, phone, state, city, address, pin_code, status } = req.body;

  // Required fields validation
  const requiredFields = ['name', 'email', 'phone', 'state', 'city', 'address', 'pin_code', 'status'];
  const errors = {};
  requiredFields.forEach(field => {
    if (!req.body[field] || req.body[field].trim() === '') {
      const label = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      errors[field] = `${label} is required`;
    }
  });
  if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

  // ✅ Check for duplicate email
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      return res.status(400).json({ errors: { email: 'Email already exists' } });
    }

    // If no duplicate, insert user
    const image = req.file ? '/uploads/users/' + req.file.filename : '';
    const normalizedStatus = ['1', 1, true, 'true'].includes(status) ? '1' : '0';

    const sql = `
      INSERT INTO users (name, email, phone, state, city, address, pin_code, image, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, phone, state, city, address, pin_code, image, normalizedStatus], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id: result.insertId,
        name, email, phone, state, city, address, pin_code, image, status: normalizedStatus
      });
    });
  });
});

// 🟧 Update existing user (✅ handles optional new image + duplicate email check)
router.put('/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  let { name, email, phone, state, city, address, pin_code, status } = req.body;

  // Required fields validation
  const requiredFields = ['name', 'email', 'phone', 'state', 'city', 'address', 'pin_code', 'status'];
  const errors = {};
  requiredFields.forEach(field => {
    if (!req.body[field] || req.body[field].trim() === '') {
      const label = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      errors[field] = `${label} is required`;
    }
  });
  if (Object.keys(errors).length > 0) return res.status(400).json({ errors });

  // Normalize status
  status = ['1', 1, true, 'true'].includes(status) ? '1' : '0';

  const data = { name, email, phone, state, city, address, pin_code, status };

  // ✅ Check if the email already exists for another user
  db.query('SELECT id FROM users WHERE email=? AND id!=?', [email, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length > 0) {
      return res.status(400).json({ errors: { email: 'Email already exists' } });
    }

    // ✅ Handle new image upload
    if (req.file) {
      data.image = '/uploads/users/' + req.file.filename;

      // Delete old image safely
      db.query('SELECT image FROM users WHERE id=?', [id], (err, result) => {
        if (!err && result.length && result[0].image) {
          const oldPath = path.join('public', result[0].image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
      });
    }

    // Prepare update query
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(f => `${f}=?`).join(', ');
    const sql = `UPDATE users SET ${setClause} WHERE id=?`;

    // Execute update
    db.query(sql, [...values, id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

      res.json({
        message: '✅ User updated successfully',
        user: { id, ...data }
      });
    });
  });
});



router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Get user image path
    const [results] = await new Promise((resolve, reject) => {
      db.query('SELECT image FROM users WHERE id=?', [id], (err, results) => {
        if (err) reject(err);
        else resolve([results]);
      });
    });

    if (results.length && results[0].image) {
      let imagePath = results[0].image;

      if (imagePath.startsWith('/')) {
        imagePath = imagePath.slice(1);
      }

      const fullPath = path.join(__dirname, '..', '..', 'public', imagePath);

      // Delete file if exists
      try {
        await fsPromises.access(fullPath);
        await fsPromises.unlink(fullPath);
        console.log('✅ Deleted image:', fullPath);
      } catch {
        console.log('⚠️ Image file not found:', fullPath);
      }
    }

    // Delete user record
    db.query('DELETE FROM users WHERE id=?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: `🗑️ User ${id} deleted successfully` });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
