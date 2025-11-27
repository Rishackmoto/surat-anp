const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const { poolPromise } = require("./db");

// 🔍 Log environment variable untuk debugging
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'Not Set');
console.log('DB_SERVER:', process.env.DB_SERVER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('API_BASE_URL:', process.env.API_BASE_URL);


const app = express(); // 👉 HARUS ADA DI ATAS SEMUA MIDDLEWARE

// Allowed origins
const allowedOrigins = [
  "https://surat-anp-api.up.railway.app",
  "https://app.rishackmoto.com",
  "http://localhost:3000"
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("API Surat ANP is running");
});

// POST Surat
app.post("/surat", async (req, res) => {
  try {
    const { Jenis, Divisi, Perihal, Tujuan, TanggalSurat, UserCreated } = req.body;

    const pool = await poolPromise;
    const request = pool.request();

    request.input("Jenis", Jenis);
    request.input("Divisi", Divisi);
    request.input("Perihal", Perihal);
    request.input("Tujuan", Tujuan);
    request.input("TanggalSurat", TanggalSurat);
    request.input("UserCreated", UserCreated);

    const result = await request.execute("GenerateNomorSurat");

    return res.json({
      success: true,
      nomor: result.recordset[0].NomorSurat
    });

  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
});

// GET Surat
app.get("/surat", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT * FROM Surat ORDER BY CreatedAt DESC");

    return res.json({
      success: true,
      data: result.recordset
    });

  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
