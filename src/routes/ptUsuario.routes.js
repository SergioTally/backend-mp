const express = require("express");
const router = express.Router();
const ptUsuarioController = require("../controllers/ptUsuario.controller");

router.get("/", ptUsuarioController.getAll);
router.get("/:id", ptUsuarioController.getById);
router.post("/", ptUsuarioController.create);
router.put("/:id", ptUsuarioController.update);
router.delete("/:id", ptUsuarioController.remove);

module.exports = router;
