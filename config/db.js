const mysql = require('mysql2');

// Create a connection pool
const db = mysql.createPool({
  host: 'localhost',      // your DB host
  user: 'root',           // your MySQL username
  password: '',           // your MySQL password
  database: 'demo_project' // your database name
});

// Check connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database!');
    connection.release();
  }
});

module.exports = db;
