const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sqlConfig } = require("./config");

const app = express();
app.use(cors());
app.use(bodyParser.json());

sql.connect(sqlConfig)
  .then(() => console.log("Connected to SQL Server"))
  .catch(err => console.error("SQL connection failed", err));

  app.post("/surat", async (req, res) => {
  try {
    const { Jenis, Divisi, Perihal, Tujuan, TanggalSurat, UserCreated } = req.body;

    const request = new sql.Request();
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



app.get("/surat", async (req, res) => {
  try {
    const pool = await sql.connect(sqlConfig);
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
app.listen(3000, () => console.log("API running on port 3000"));
