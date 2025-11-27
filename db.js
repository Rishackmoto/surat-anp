require("dotenv").config({ path: 'D://flutter/2025/surat_anp/.env' });
console.log("🔍 DB_SERVER dari .env:", process.env.DB_SERVER);

const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("🟢 Koneksi berhasil");
    return pool;
  })
  .catch(err => console.error("❌ Koneksi gagal!", err));

module.exports = {
  sql,
  poolPromise
};
