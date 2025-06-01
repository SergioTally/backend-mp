const db = require("../../models");
const ApiError = require("../utils/apiError");
const PtCaso = db.PT_CASO;
const PtFiscal = db.PT_FISCAL;
const PtPersona = db.PT_PERSONA;
const PtFiscalia = db.PT_FISCALIA;
const EstadoCaso = db.PT_ESTADO_CASO;
const TipoCaso = db.PT_TIPO_CASO;
const Logs = db.PT_LOGS;

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

exports.asignarFiscal = async (data, idUsuario) => {
  const { ID_CASO, ID_FISCAL } = data;
  if (!ID_CASO || !ID_FISCAL)
    throw new ApiError("ID_CASO e ID_FISCAL son obligatorios", 400);

  const caso = await PtCaso.findByPk(ID_CASO);
  if (!caso) throw new ApiError("Caso no encontrado", 404);

  // Validar que el caso esté en estado "PENDIENTE" (por ejemplo, ID_ESTADO_CASO === 1)
  const ESTADO_PENDIENTE_ID = 1;
  if (caso.ID_ESTADO_CASO !== ESTADO_PENDIENTE_ID) {
    throw new ApiError(
      "Solo se puede asignar fiscal si el caso está en estado 'PENDIENTE'",
      400
    );
  }

  const fiscal = await PtFiscal.findByPk(ID_FISCAL, {
    include: [{ model: PtFiscalia, as: "FISCALIA" }],
  });
  if (!fiscal) throw new ApiError("Fiscal no encontrado", 404);

  const fiscaliaNueva = fiscal.FISCALIA?.ID_FISCALIA || null;

  if (caso.ID_FISCAL) {
    const fiscalActual = await PtFiscal.findByPk(caso.ID_FISCAL, {
      include: [{ model: PtFiscalia, as: "FISCALIA" }],
    });

    const fiscaliaActual = fiscalActual?.FISCALIA?.ID_FISCALIA || null;
    if (fiscaliaNueva && fiscaliaActual && fiscaliaNueva !== fiscaliaActual) {
      await Logs.create({
        TABLA: "PT_CASO",
        IDENTIFICADOR: ID_CASO,
        ACCION: "ASIGNACION_INVALIDA",
        DATO_ANTERIOR: JSON.stringify({
          fiscalActual: fiscalActual.ID_FISCAL,
          fiscaliaActual,
        }),
        DATO_POSTERIOR: JSON.stringify({
          fiscalNuevo: fiscal.ID_FISCAL,
          fiscaliaNueva,
        }),
        ID_USUARIO: idUsuario,
        COMENTARIO: "No se puede asignar fiscal de distinta fiscalía",
      });

      throw new ApiError("No se puede asignar fiscal de otra fiscalía", 409);
    }
  }

  const casoAnterior = caso.toJSON();
  await caso.update({ ID_FISCAL: ID_FISCAL });

  await Logs.create({
    TABLA: "PT_CASO",
    IDENTIFICADOR: ID_CASO,
    ACCION: "ASIGNACION_FISCAL",
    DATO_ANTERIOR: JSON.stringify({ ID_FISCAL: casoAnterior.ID_FISCAL }),
    DATO_POSTERIOR: JSON.stringify({ ID_FISCAL }),
    ID_USUARIO: idUsuario,
    COMENTARIO: "Asignación de fiscal",
  });

  return caso;
};

exports.modificarEstado = async (data, idUsuario) => {
  const { ID_CASO, ID_ESTADO_CASO } = data;
  if (!ID_CASO || !ID_ESTADO_CASO)
    throw new ApiError("ID_CASO e ID_ESTADO_CASO son obligatorios", 400);

  const caso = await PtCaso.findByPk(ID_CASO);
  if (!caso) throw new ApiError("Caso no encontrado", 404);

  const estadoAnterior = caso.ID_ESTADO_CASO;
  await caso.update({ ID_ESTADO_CASO });

  await Logs.create({
    TABLA: "PT_CASO",
    IDENTIFICADOR: ID_CASO,
    ACCION: "CAMBIO_ESTADO",
    DATO_ANTERIOR: JSON.stringify({ ID_ESTADO_CASO: estadoAnterior }),
    DATO_POSTERIOR: JSON.stringify({ ID_ESTADO_CASO }),
    ID_USUARIO: idUsuario,
    COMENTARIO: "Cambio de estado del caso",
  });

  return caso;
};
