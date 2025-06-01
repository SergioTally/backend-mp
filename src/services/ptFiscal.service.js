const db = require("../../models");
const ApiError = require("../utils/apiError");
const PtFiscal = db.PT_FISCAL;

exports.getAll = async () => {
  try {
    return await PtFiscal.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    });
  } catch (error) {
    throw new ApiError("Error al obtener ptFiscals");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtFiscal.findByPk(id);
    if (!item) throw new ApiError("PtFiscal no encontrado", 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar ptFiscal");
  }
};

exports.create = async (data) => {
  try {
    return await PtFiscal.create(data);
  } catch (error) {
    throw new ApiError("Error al crear el ptFiscal: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtFiscal.findByPk(id);
    if (!item) throw new ApiError("PtFiscal no encontrado", 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError(
      "Error al actualizar el ptFiscal: " + error.message,
      400
    );
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtFiscal.findByPk(id);
    if (!item) throw new ApiError("PtFiscal no encontrado", 404);

    await item.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return item;
  } catch (error) {
    throw new ApiError("Error al eliminar el ptFiscal: " + error.message, 400);
  }
};
