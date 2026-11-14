const express = require("express");
const controller = require("../controllers/taskController");

const router = express.Router();

router.get("/", controller.listele);
router.get("/:id", controller.detay);
router.post("/", controller.ekle);
router.put("/:id", controller.guncelle);
router.delete("/:id", controller.sil);

module.exports = router;
