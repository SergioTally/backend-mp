const db = require("../../models");
const ApiError = require("../utils/apiError");
const Sequelize = require("sequelize");
const PtFiscalia = db.PT_FISCALIA;

exports.getAll = async () => {
  try {
    return await PtFiscalia.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    });
  } catch (error) {
    throw new ApiError("Error al obtener ptFiscalias");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtFiscalia.findByPk(id);
    if (!item) throw new ApiError("PtFiscalia no encontrado", 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar ptFiscalia");
  }
};

exports.create = async (data) => {
  try {
    return await PtFiscalia.create(data);
  } catch (error) {
    throw new ApiError("Error al crear el ptFiscalia: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtFiscalia.findByPk(id);
    if (!item) throw new ApiError("PtFiscalia no encontrado", 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError(
      "Error al actualizar el ptFiscalia: " + error.message,
      400
    );
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtFiscalia.findByPk(id);
    if (!item) throw new ApiError("PtFiscalia no encontrado", 404);

    await item.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return item;
  } catch (error) {
    throw new ApiError(
      "Error al eliminar el ptFiscalia: " + error.message,
      400
    );
  }
};
