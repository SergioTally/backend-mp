const ptUsuarioService = require("../services/ptUsuario.service");

exports.getAll = async (req, res) => {
  try {
    const data = await ptUsuarioService.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ptUsuarioService.getById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevo = await ptUsuarioService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const actualizado = await ptUsuarioService.update(req.params.id, req.body);
    if (!actualizado)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const eliminado = await ptUsuarioService.remove(req.params.id);
    if (!eliminado)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
