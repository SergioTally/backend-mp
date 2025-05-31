const db = require("../../models");
const ApiError = require("../utils/apiError");
const Usuario = db.PT_USUARIO;

exports.getAll = async () => {
  try {
    return await Usuario.findAll({
      attributes: { exclude: ["PASSWORD"] },
    });
  } catch (error) {
    throw new ApiError("Error al obtener usuarios");
  }
};

exports.getById = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ["PASSWORD"] },
    });

    if (!usuario) throw new ApiError("Usuario no encontrado", 404);
    return usuario;
  } catch (error) {
    throw error instanceof ApiError
      ? error
      : new ApiError("Error al buscar usuario");
  }
};

exports.create = async (data) => {
  try {
    const { USERNAME, PASSWORD } = data;

    if (!USERNAME || !PASSWORD) {
      throw new ApiError("USERNAME y PASSWORD son obligatorios", 400);
    }

    return await Usuario.create({ USERNAME, PASSWORD });
  } catch (error) {
    throw new ApiError("Error al crear el usuario: " + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new ApiError("Usuario no encontrado", 404);

    const { PASSWORD, ACTIVO } = data;

    return await usuario.update({ PASSWORD, ACTIVO });
  } catch (error) {
    throw new ApiError("Error al actualizar el usuario: " + error.message, 400);
  }
};

exports.remove = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new ApiError("Usuario no encontrado", 404);

    await usuario.destroy();
    return usuario;
  } catch (error) {
    throw new ApiError("Error al eliminar el usuario: " + error.message, 400);
  }
};
