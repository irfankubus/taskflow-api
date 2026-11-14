const express = require("express");
const logger = require("./middleware/logger");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // JSON gövdeleri okumak için
app.use(logger); // tüm istekleri kaydeder

app.get("/", (req, res) => {
  res.json({ mesaj: "TaskFlow API çalışıyor.", endpoint: "/tasks" });
});

app.use("/tasks", taskRoutes);

// Tanımsız endpoint
app.use((req, res) => {
  res.status(404).json({ hata: "Endpoint bulunamadı." });
});

// Geçersiz JSON gövdesi vb. hatalar
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ hata: "Geçersiz JSON gövdesi." });
  }
  console.error(err);
  res.status(500).json({ hata: "Sunucu hatası." });
});

app.listen(PORT, () => {
  console.log(`TaskFlow API http://localhost:${PORT} adresinde çalışıyor`);
});
