const db = require("../../models");
const ApiError = require("../utils/apiError");
const PtPersona = db.PT_PERSONA;

exports.getAll = async () => {
  try {
    return await PtPersona.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    });
  } catch (error) {
    throw new ApiError("Error al obtener ptPersonas");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtPersona.findByPk(id);
    if (!item) throw new ApiError("PtPersona no encontrado", 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar ptPersona");
  }
};

exports.create = async (data) => {
  try {
    return await PtPersona.create(data);
  } catch (error) {
    throw new ApiError("Error al crear el ptPersona: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtPersona.findByPk(id);
    if (!item) throw new ApiError("PtPersona no encontrado", 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError(
      "Error al actualizar el ptPersona: " + error.message,
      400
    );
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtPersona.findByPk(id);
    if (!item) throw new ApiError("PtPersona no encontrado", 404);

    await item.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return item;
  } catch (error) {
    throw new ApiError("Error al eliminar el ptPersona: " + error.message, 400);
  }
};
