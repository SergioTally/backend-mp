const db = require("../../models");
const ApiError = require("../utils/apiError");
const PtRole = db.PT_ROLE;
const Sequelize = require("sequelize");

exports.getAll = async () => {
  try {
    return await PtRole.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    });
  } catch (error) {
    throw new ApiError("Error al obtener ptRoles");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtRole.findByPk(id);
    if (!item) throw new ApiError("PtRole no encontrado", 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar ptRole");
  }
};

exports.create = async (data) => {
  try {
    return await PtRole.create(data);
  } catch (error) {
    throw new ApiError("Error al crear el ptRole: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtRole.findByPk(id);
    if (!item) throw new ApiError("PtRole no encontrado", 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError("Error al actualizar el ptRole: " + error.message, 400);
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtRole.findByPk(id);
    if (!item) throw new ApiError("PtRole no encontrado", 404);

    await item.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return item;
  } catch (error) {
    throw new ApiError("Error al eliminar el ptRole: " + error.message, 400);
  }
};
