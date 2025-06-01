const db = require("../../models");
const ApiError = require("../utils/apiError");
const Sequelize = require("sequelize");
const PtLogs = db.PT_LOGS;

exports.getAll = async () => {
  try {
    return await PtLogs.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    });
  } catch (error) {
    throw new ApiError("Error al obtener ptLogss");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtLogs.findByPk(id);
    if (!item) throw new ApiError("PtLogs no encontrado", 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar ptLogs");
  }
};

exports.create = async (data) => {
  try {
    return await PtLogs.create(data);
  } catch (error) {
    throw new ApiError("Error al crear el ptLogs: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtLogs.findByPk(id);
    if (!item) throw new ApiError("PtLogs no encontrado", 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError("Error al actualizar el ptLogs: " + error.message, 400);
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtLogs.findByPk(id);
    if (!item) throw new ApiError("PtLogs no encontrado", 404);

    await item.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return item;
  } catch (error) {
    throw new ApiError("Error al eliminar el ptLogs: " + error.message, 400);
  }
};

exports.buscarPorTablaEIdentificador = async (tabla, identificador) => {
  try {
    return await PtLogs.findAll({
      where: {
        TABLA: tabla,
        IDENTIFICADOR: identificador,
      },
      include: [
        {
          model: db.PT_USUARIO,
          as: "USUARIO",
          attributes: ["USERNAME"],
        },
      ],
      order: [["FECHA_REGISTRO", "DESC"]],
    });
  } catch (error) {
    console.log("error--", error);
    throw new ApiError("Error al buscar logs", 500);
  }
};
