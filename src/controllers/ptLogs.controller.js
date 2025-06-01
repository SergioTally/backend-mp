const ptLogsService = require("../services/ptLogs.service");

exports.getAll = async (req, res) => {
  try {
    const data = await ptLogsService.getAll();
    res.json(data);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await ptLogsService.getById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevo = await ptLogsService.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const actualizado = await ptLogsService.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const eliminado = await ptLogsService.remove(req.params.id);
    res.json({ message: "PtLogs eliminado", eliminado });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.buscarPorTablaEIdentificador = async (req, res) => {
  try {
    const { tabla, identificador } = req.params;

    if (!tabla || !identificador) {
      return res
        .status(400)
        .json({ message: "tabla e identificador son obligatorios" });
    }

    const logs = await ptLogsService.buscarPorTablaEIdentificador(
      tabla,
      identificador
    );
    res.json(logs);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
