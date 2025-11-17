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


const { Sequelize } = require('sequelize');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Error: ' + err));

module.exports = sequelize;