const pool = require("../database/mysql");
// Middleware function to create a table if it doesn't exist
const createTableIfNotExist = (tableName, tableColumns) => {
  const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${tableColumns})`;
  pool.query(sql, (err, result) => {
    if (err) throw err;
    console.log("heyy ",result);
    console.log(`${tableName} table created successfully!`);
  });
};

module.exports = createTableIfNotExist;