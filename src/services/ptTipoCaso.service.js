const db = require("../../models");
const ApiError = require("../utils/apiError");
const PtTipoCaso = db.PT_TIPO_CASO;
const Sequelize = require("sequelize");

exports.getAll = async () => {
  try {
    return await PtTipoCaso.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    });
  } catch (error) {
    throw new ApiError("Error al obtener TipoCasos");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtTipoCaso.findByPk(id);
    if (!item) throw new ApiError("TipoCaso no encontrado", 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar TipoCaso");
  }
};

exports.create = async (data) => {
  try {
    return await PtTipoCaso.create(data);
  } catch (error) {
    throw new ApiError("Error al crear el TipoCaso: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtTipoCaso.findByPk(id);
    if (!item) throw new ApiError("TipoCaso no encontrado", 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError(
      "Error al actualizar el TipoCaso: " + error.message,
      400
    );
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtTipoCaso.findByPk(id);
    if (!item) throw new ApiError("TipoCaso no encontrado", 404);

    await item.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return item;
  } catch (error) {
    throw new ApiError("Error al eliminar el TipoCaso: " + error.message, 400);
  }
};
