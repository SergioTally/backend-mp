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

exports.reporteExcel = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estado, idFiscal } = req.body;
    const rol = req.user.rol;
    const idUsuario = req.user.id;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Las fechas son obligatorias" });
    }

    const buffer = await ptCasoService.generarExcel({
      fechaInicio,
      fechaFin,
      estado,
      idFiscal,
      rol,
      idUsuario,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte_casos.xlsx"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generarInformePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const buffer = await ptCasoService.generarInformePDF(id);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Informe_Caso_${id}.pdf`
    );
    res.send(buffer);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.resumenCasos = async (req, res) => {
  try {
    const resumen = await ptCasoService.getResumenCasos();
    res.json(resumen);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener resumen de casos" });
  }
};
