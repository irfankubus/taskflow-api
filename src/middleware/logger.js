const fs = require("fs");
const path = require("path");

const logDosyasi = path.join(__dirname, "..", "..", "requests.log");

// Tüm isteklerin method, endpoint ve zaman damgasını konsola ve log dosyasına yazar.
function logger(req, res, next) {
  const satir = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
  console.log(satir);
  fs.appendFile(logDosyasi, satir + "\n", (err) => {
    if (err) console.error("Log dosyasına yazılamadı:", err.message);
  });
  next();
}

module.exports = logger;
