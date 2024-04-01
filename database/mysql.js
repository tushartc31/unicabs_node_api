const  { createPool } = require("mysql");

let dbConfig = {
    port : process.env.MYSQL_PORT,
    host : process.env.MYSQL_HOST,
    user :  process.env.MYSQL_USER,
    password : process.env.MYSQL_PASS,
    database : process.env.MYSQL_DB,
    timezone: 'UTC',
    dateStrings: ['DATE','DATETIME'],
    connectionLimit : 100,
    connectionTimeout : 40000,
    waitForConnections: true
};
const pool = createPool(dbConfig);
pool.on('connection',conn => {
    conn.query("SET time_zone = '+05:30';", err => {})
})
// Ping database to check for common exception errors.
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.log('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.log('Database connection was refused.');
    }
  }

  if (connection) connection.release();

  return
})

// Promisify for Node.js async/await.
//pool.query = promisify(pool.query);

module.exports = pool;