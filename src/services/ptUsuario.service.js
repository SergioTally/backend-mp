const db = require("../../models");
const ApiError = require("../utils/apiError");
const Usuario = db.PT_USUARIO;
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

exports.getAll = async () => {
  try {
    return await Usuario.findAll({
      attributes: { exclude: ["PASSWORD", "FECHA_ELIMINO"] },
      where: {
        ACTIVO: true,
      },
      include: [
        {
          model: db.PT_ROLE_PERMISO_USUARIO,
          as: "rolesAsignados",
          include: [
            {
              model: db.PT_ROLE,
              as: "ROL",
              attributes: ["ID_ROLE", "NOMBRE"],
              where: { ACTIVO: true },
              required: false,
            },
          ],
        },
      ],
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

    const updateData = { ...data };

    if (updateData.PASSWORD) {
      updateData.PASSWORD = await bcrypt.hash(updateData.PASSWORD, 10);
    }

    return await usuario.update(updateData);
  } catch (error) {
    throw new ApiError("Error al actualizar el usuario: " + error.message, 400);
  }
};

exports.remove = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) throw new ApiError("Usuario no encontrado", 404);

    await usuario.update({
      FECHA_ELIMINO: Sequelize.literal("GETDATE()"),
      ACTIVO: false,
    });
    return usuario;
  } catch (error) {
    throw new ApiError("Error al eliminar el usuario: " + error.message, 400);
  }
};
