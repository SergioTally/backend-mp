const db = require("../../models");
const ApiError = require("../utils/apiError");
const PtCaso = db.PT_CASO;
const PtFiscal = db.PT_FISCAL;
const PtPersona = db.PT_PERSONA;
const PtFiscalia = db.PT_FISCALIA;
const EstadoCaso = db.PT_ESTADO_CASO;
const TipoCaso = db.PT_TIPO_CASO;

exports.getAll = async () => {
  try {
    return await PtCaso.findAll({
      where: {
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
      include: [
        {
          model: PtFiscal,
          as: "FISCAL",
          include: [
            {
              model: PtFiscalia,
              as: "FISCALIA",
            },
            {
              model: PtPersona,
              as: "PERSONA",
            },
          ],
        },
        {
          model: EstadoCaso,
          as: "ESTADO_CASO",
        },
        {
          model: TipoCaso,
          as: "TIPO_CASO",
        },
      ],
    });
  } catch (error) {
    throw new ApiError("Error al obtener ptCasos");
  }
};

exports.getById = async (id) => {
  try {
    const item = await PtCaso.findByPk(id, {
      include: [
        {
          model: PtFiscal,
          as: "FISCAL",
          include: [
            {
              model: PtFiscalia,
              as: "FISCALIA",
            },
          ],
        },
        {
          model: EstadoCaso,
          as: "ESTADO_CASO",
        },
        {
          model: TipoCaso,
          as: "TIPO_CASO",
        },
      ],
    });

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
