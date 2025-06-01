const db = require("../../models");
const ApiError = require("../utils/apiError");
const PtPermiso = db.PT_PERMISO;

exports.getAll = async () => {
  try {
    return await PtPermiso.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    });
  } catch (error) {
    throw new ApiError("Error al obtener ptPermisos");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtPermiso.findByPk(id);
    if (!item) throw new ApiError("PtPermiso no encontrado", 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar ptPermiso");
  }
};

exports.create = async (data) => {
  try {
    return await PtPermiso.create(data);
  } catch (error) {
    throw new ApiError("Error al crear el ptPermiso: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtPermiso.findByPk(id);
    if (!item) throw new ApiError("PtPermiso no encontrado", 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError(
      "Error al actualizar el ptPermiso: " + error.message,
      400
    );
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtPermiso.findByPk(id);
    if (!item) throw new ApiError("PtPermiso no encontrado", 404);

    await item.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return item;
  } catch (error) {
    throw new ApiError("Error al eliminar el ptPermiso: " + error.message, 400);
  }
};
