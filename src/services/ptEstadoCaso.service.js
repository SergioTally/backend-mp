const db = require('../../models');
const ApiError = require('../utils/apiError');
const PtEstadoCaso = db.PT_ESTADO_CASO;

exports.getAll = async () => {
  try {
    return await PtEstadoCaso.findAll();
  } catch (error) {
    throw new ApiError('Error al obtener EstadoCasos');
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtEstadoCaso.findByPk(id);
    if (!item) throw new ApiError('EstadoCaso no encontrado', 404);
    return item;
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Error al buscar ptEstadoCaso');
  }
};

exports.create = async (data) => {
  try {
    return await PtEstadoCaso.create(data);
  } catch (error) {
    throw new ApiError('Error al crear el ptEstadoCaso: ' + error.message, 400);
  }
};

exports.update = async (id, data) => {
  try {
    const item = await PtEstadoCaso.findByPk(id);
    if (!item) throw new ApiError('PtEstadoCaso no encontrado', 404);

    return await item.update(data);
  } catch (error) {
    throw new ApiError('Error al actualizar el ptEstadoCaso: ' + error.message, 400);
  }
};

exports.remove = async (id) => {
  try {
    const item = await PtEstadoCaso.findByPk(id);
    if (!item) throw new ApiError('PtEstadoCaso no encontrado', 404);

    await item.destroy();
    return item;
  } catch (error) {
    throw new ApiError('Error al eliminar el ptEstadoCaso: ' + error.message, 400);
  }
};
