const db = require("../../models");
const ApiError = require("../utils/apiError");
const ExcelJS = require("exceljs");
const { Op, literal, Sequelize } = require("sequelize");
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

exports.generarInformePDF = async (idCaso) => {
  const logs = await Logs.findAll({
    where: { TABLA: "PT_CASO", IDENTIFICADOR: idCaso },
    include: [{ model: PtUsuario, as: "USUARIO" }],
    order: [["FECHA_REGISTRO", "ASC"]],
  });

  const doc = new PDFDocument({ margin: 50 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  // Encabezado
  doc
    .fontSize(20)
    .fillColor("#0a0a0a")
    .text(`Informe de Movimientos del Caso #${idCaso}`, {
      align: "center",
      underline: true,
    });
  doc.moveDown(1.5);

  for (const log of logs) {
    const fecha = new Date(log.FECHA_REGISTRO);
    const fechaTexto = fecha.toLocaleString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    doc
      .fontSize(11)
      .fillColor("#666")
      .text(`${fechaTexto}`, { continued: false })
      .moveDown(0.3);

    let descripcion = "";

    switch (log.ACCION) {
      case "ASIGNACION_FISCAL":
        {
          const anterior = JSON.parse(log.DATO_ANTERIOR || "{}");
          const posterior = JSON.parse(log.DATO_POSTERIOR || "{}");
          const fiscalAnterior = await obtenerNombreFiscal(anterior.ID_FISCAL);
          const fiscalNuevo = await obtenerNombreFiscal(posterior.ID_FISCAL);

          descripcion = `Fiscal cambiado de "${fiscalAnterior}" a "${fiscalNuevo}".`;
        }
        break;

      case "CAMBIO_ESTADO":
        {
          const anterior = JSON.parse(log.DATO_ANTERIOR || "{}");
          const posterior = JSON.parse(log.DATO_POSTERIOR || "{}");
          const estadoAnterior = await obtenerNombreEstado(
            anterior.ID_ESTADO_CASO
          );
          const estadoNuevo = await obtenerNombreEstado(
            posterior.ID_ESTADO_CASO
          );

          descripcion = `Estado cambiado de "${estadoAnterior}" a "${estadoNuevo}".`;
        }
        break;

      case "ASIGNACION_INVALIDA":
        {
          const datos = JSON.parse(log.DATO_POSTERIOR || "{}");
          const fiscalNuevo = await obtenerNombreFiscal(datos.fiscalNuevo);
          const fiscaliaNueva = await obtenerNombreFiscalia(
            datos.fiscaliaNueva
          );

          descripcion = `Intento inválido de asignación al fiscal "${fiscalNuevo}" (Fiscalía: "${fiscaliaNueva}").`;
        }
        break;

      default:
        descripcion = `Acción: ${log.ACCION}. Comentario: ${log.COMENTARIO}`;
        break;
    }

    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Usuario: ${log.USUARIO?.USERNAME || "N/A"}`)
      .moveDown(0.2);
    doc.font("Helvetica").text(descripcion).moveDown(0.5);

    doc
      .strokeColor("#CCCCCC")
      .lineWidth(0.5)
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.options.margin, doc.y)
      .stroke()
      .moveDown(1);
  }

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });
};

// Funciones auxiliares

async function obtenerNombreFiscal(id) {
  if (!id) return "Sin Fiscal";
  const fiscal = await PtFiscal.findByPk(id, {
    include: [{ model: PtPersona, as: "PERSONA" }],
  });
  return fiscal
    ? `${fiscal.PERSONA.PRIMER_NOMBRE} ${fiscal.PERSONA.PRIMER_APELLIDO}`
    : "Fiscal desconocido";
}

async function obtenerNombreFiscalia(id) {
  if (!id) return "Sin Fiscalía";
  const fiscalia = await PtFiscalia.findByPk(id);
  return fiscalia ? fiscalia.NOMBRE : "Fiscalía desconocida";
}

async function obtenerNombreEstado(id) {
  if (!id) return "Sin Estado";
  const estado = await EstadoCaso.findByPk(id);
  return estado ? estado.NOMBRE : "Estado desconocido";
}

exports.getResumenCasos = async () => {
  const [sinAsignar, asignados, finalizados] = await Promise.all([
    PtCaso.count({
      where: {
        ID_FISCAL: null,
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    }),
    PtCaso.count({
      where: {
        ID_FISCAL: { [Op.not]: null },
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    }),
    PtCaso.count({
      where: {
        ID_ESTADO_CASO: 8,
        ACTIVO: true,
        FECHA_ELIMINO: null,
      },
    }),
  ]);

  return { sinAsignar, asignados, finalizados };
};
