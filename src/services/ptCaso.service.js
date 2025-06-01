const db = require("../../models");
const ApiError = require("../utils/apiError");
const ExcelJS = require("exceljs");
const { Op, literal } = require("sequelize");
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

  // Validar que el caso esté en estado "PENDIENTE"
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

exports.generarExcel = async ({
  fechaInicio,
  fechaFin,
  estado,
  idFiscal,
  rol,
  idUsuario,
}) => {
  const where = {
    [Op.and]: [
      literal(
        `[PT_CASO].[FECHA_REGISTRO] BETWEEN '${fechaInicio}' AND '${fechaFin}'`
      ),
      { ACTIVO: true },
      { FECHA_ELIMINO: null },
    ],
  };

  if (estado && estado !== "TODOS") {
    where[Op.and].push({ ID_ESTADO_CASO: estado });
  }

  console.log("rol--", rol);
  console.log("idFiscal--", idFiscal);

  if (rol === "FISCAL") {
    where[Op.and].push({ ID_FISCAL: idUsuario });
  } else if (rol === "ADMINISTRADOR" && idFiscal) {
    where[Op.and].push({ ID_FISCAL: idFiscal });
  }

  const casos = await PtCaso.findAll({
    where,
    include: [
      { model: EstadoCaso, as: "ESTADO_CASO" },
      { model: TipoCaso, as: "TIPO_CASO" },
      {
        model: PtFiscal,
        as: "FISCAL",
        include: [
          { model: PtPersona, as: "PERSONA" },
          { model: PtFiscalia, as: "FISCALIA" },
        ],
      },
    ],
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Casos");

  sheet.columns = [
    { header: "ID", key: "ID_CASO", width: 10 },
    { header: "Correlativo", key: "CORRELATIVO", width: 20 },
    { header: "Nombre", key: "NOMBRE", width: 25 },
    { header: "Observación", key: "OBSERVACION", width: 30 },
    { header: "Estado", key: "ESTADO", width: 15 },
    { header: "Tipo", key: "TIPO", width: 15 },
    { header: "Fiscal", key: "FISCAL", width: 25 },
    { header: "Fiscalía", key: "FISCALIA", width: 25 },
    { header: "Fecha Registro", key: "FECHA_REGISTRO", width: 20 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF007ACC" },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };
  });

  casos.forEach((caso) => {
    sheet.addRow({
      ID_CASO: caso.ID_CASO,
      CORRELATIVO: caso.CORRELATIVO,
      NOMBRE: caso.NOMBRE,
      OBSERVACION: caso.OBSERVACION,
      ESTADO: caso.ESTADO_CASO?.NOMBRE || "N/A",
      TIPO: caso.TIPO_CASO?.NOMBRE || "N/A",
      FISCAL: caso.FISCAL?.PERSONA
        ? `${caso.FISCAL.PERSONA.PRIMER_NOMBRE} ${caso.FISCAL.PERSONA.SEGUNDO_NOMBRE} ${caso.FISCAL.PERSONA.PRIMER_APELLIDO} ${caso.FISCAL.PERSONA.SEGUNDO_APELLIDO}`
        : "N/A",
      FISCALIA: caso.FISCAL?.FISCALIA?.NOMBRE || "N/A",
      FECHA_REGISTRO: caso.FECHA_REGISTRO,
    });
  });

  sheet.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  return await workbook.xlsx.writeBuffer();
};
