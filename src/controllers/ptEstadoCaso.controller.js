const ptEstadoCasoService = require("../services/ptEstadoCaso.service");

exports.getAll = async (req, res) => {
  try {
    const data = await ptEstadoCasoService.getAll();
    res.json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ptEstadoCasoService.getById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevo = await ptEstadoCasoService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const actualizado = await ptEstadoCasoService.update(
      req.params.id,
      req.body
    );
    res.json(actualizado);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const eliminado = await ptEstadoCasoService.remove(req.params.id);
    res.json({ message: "PtEstadoCaso eliminado", eliminado });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
