const fs = require("fs");
const path = require("path");

const veriDosyasi = path.join(__dirname, "..", "data", "tasks.json");

const GECERLI_DURUMLAR = ["pending", "in-progress", "completed"];
const GECERLI_ONCELIKLER = ["low", "medium", "high"];

// --- Veri okuma / yazma yardımcıları (JSON dosyası) ---
function gorevleriOku() {
  return JSON.parse(fs.readFileSync(veriDosyasi, "utf8"));
}

function gorevleriKaydet(gorevler) {
  fs.writeFileSync(veriDosyasi, JSON.stringify(gorevler, null, 2), "utf8");
}

function sonrakiId(gorevler) {
  return gorevler.length ? Math.max(...gorevler.map((g) => g.id)) + 1 : 1;
}

// Gövdedeki status/priority değerlerini kontrol eder; hata varsa mesaj döner.
function alanHatasi(body) {
  if (body.status !== undefined && !GECERLI_DURUMLAR.includes(body.status)) {
    return `status şunlardan biri olmalı: ${GECERLI_DURUMLAR.join(", ")}`;
  }
  if (body.priority !== undefined && !GECERLI_ONCELIKLER.includes(body.priority)) {
    return `priority şunlardan biri olmalı: ${GECERLI_ONCELIKLER.join(", ")}`;
  }
  return null;
}

// GET /tasks -> tüm görevler
function listele(req, res) {
  res.json(gorevleriOku());
}

// GET /tasks/:id -> tek görev
function detay(req, res) {
  const id = Number(req.params.id);
  const gorev = gorevleriOku().find((g) => g.id === id);
  if (!gorev) return res.status(404).json({ hata: "Görev bulunamadı." });
  res.json(gorev);
}

// POST /tasks -> yeni görev
function ekle(req, res) {
  const { title, description, status, priority, assignee } = req.body || {};
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ hata: "title alanı zorunludur." });
  }
  const hata = alanHatasi(req.body);
  if (hata) return res.status(400).json({ hata });

  const gorevler = gorevleriOku();
  const simdi = new Date().toISOString();
  const yeni = {
    id: sonrakiId(gorevler),
    title: title.trim(),
    description: description || "",
    status: status || "pending",
    priority: priority || "medium",
    assignee: assignee || null,
    createdAt: simdi,
    updatedAt: simdi,
  };
  gorevler.push(yeni);
  gorevleriKaydet(gorevler);
  res.status(201).json(yeni);
}

// PUT /tasks/:id -> görev güncelle
function guncelle(req, res) {
  const id = Number(req.params.id);
  const gorevler = gorevleriOku();
  const index = gorevler.findIndex((g) => g.id === id);
  if (index === -1) return res.status(404).json({ hata: "Görev bulunamadı." });

  const body = req.body || {};
  if (body.title !== undefined && (typeof body.title !== "string" || !body.title.trim())) {
    return res.status(400).json({ hata: "title boş olamaz." });
  }
  const hata = alanHatasi(body);
  if (hata) return res.status(400).json({ hata });

  const { title, description, status, priority, assignee } = body;
  const mevcut = gorevler[index];
  gorevler[index] = {
    ...mevcut,
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description }),
    ...(status !== undefined && { status }),
    ...(priority !== undefined && { priority }),
    ...(assignee !== undefined && { assignee }),
    updatedAt: new Date().toISOString(),
  };
  gorevleriKaydet(gorevler);
  res.json(gorevler[index]);
}

// DELETE /tasks/:id -> görev sil
function sil(req, res) {
  const id = Number(req.params.id);
  const gorevler = gorevleriOku();
  const index = gorevler.findIndex((g) => g.id === id);
  if (index === -1) return res.status(404).json({ hata: "Görev bulunamadı." });

  const [silinen] = gorevler.splice(index, 1);
  gorevleriKaydet(gorevler);
  res.json({ mesaj: "Görev silindi.", gorev: silinen });
}

module.exports = { listele, detay, ekle, guncelle, sil };
