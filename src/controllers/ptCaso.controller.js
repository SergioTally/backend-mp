const ptCasoService = require("../services/ptCaso.service");

exports.getAll = async (req, res) => {
  try {
    const data = await ptCasoService.getAll();
    res.json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ptCasoService.getById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevo = await ptCasoService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const actualizado = await ptCasoService.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const eliminado = await ptCasoService.remove(req.params.id);
    res.json({ message: "PtCaso eliminado", eliminado });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.asignarFiscal = async (req, res) => {
  try {
    const resultado = await ptCasoService.asignarFiscal(req.body, req.user.id);
    res.json({ message: "Fiscal asignado", resultado });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.modificarEstado = async (req, res) => {
  try {
    const resultado = await ptCasoService.modificarEstado(
      req.body,
      req.user.id
    );
    res.json({ message: "Estado modificado", resultado });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
