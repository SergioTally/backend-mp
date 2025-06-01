const db = require("../../models");
const ApiError = require("../utils/apiError");
const PtCaso = db.PT_CASO;

exports.getAll = async () => {
  try {
    return await PtCaso.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    });
  } catch (error) {
    throw new ApiError("Error al obtener ptCasos");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtCaso.findByPk(id);
    if (!item) throw new ApiError("PtCaso no encontrado", 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar ptCaso");
  }
};

exports.create = async (data) => {
  try {
    return await PtCaso.create(data);
  } catch (error) {
    throw new ApiError("Error al crear el ptCaso: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtCaso.findByPk(id);
    if (!item) throw new ApiError("PtCaso no encontrado", 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError("Error al actualizar el ptCaso: " + error.message, 400);
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtCaso.findByPk(id);
    if (!item) throw new ApiError("PtCaso no encontrado", 404);

    await item.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return item;
  } catch (error) {
    throw new ApiError("Error al eliminar el ptCaso: " + error.message, 400);
  }
};
