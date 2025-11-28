require("dotenv").config();
const sql = require("mssql");

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// 🔥 Pool DB tetap 1 agar tidak overload
const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    console.log("🟢 SQL Connected");
    return pool;
  })
  .catch(err => {
    console.error("❌ SQL Connection Failed", err);
    throw err;
  });

module.exports = { sql, poolPromise, sqlConfig };
