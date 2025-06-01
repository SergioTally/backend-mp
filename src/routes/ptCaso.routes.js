const express = require("express");
const router = express.Router();
const ptCasoController = require("../controllers/ptCaso.controller");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");

/**
 * @swagger
 * /ptCaso:
 *   get:
 *     summary: Obtener todos los registros de PtCaso
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de registros
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptCasoController.getAll
);

/**
 * @swagger
 * /ptCaso/{id}:
 *   get:
 *     summary: Obtener un ptCaso por ID
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del recurso
 *     responses:
 *       200:
 *         description: Recurso encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 *       404:
 *         description: Recurso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptCasoController.getById
);

/**
 * @swagger
 * /ptCaso:
 *   post:
 *     summary: Crear nuevo caso
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CORRELATIVO
 *             properties:
 *               ID_FISCAL:
 *                 type: integer
 *                 example: 2
 *               CORRELATIVO:
 *                 type: string
 *                 example: "2024-0001"
 *               NOMBRE:
 *                 type: string
 *                 example: "Caso ejemplo"
 *               OBSERVACION:
 *                 type: string
 *                 example: "Observación general"
 *               ACTIVO:
 *                 type: boolean
 *                 example: true
 *               ID_ESTADO_CASO:
 *                 type: integer
 *                 example: 1
 *               ID_TIPO_CASO:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Recurso creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 */
router.post(
  "/",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptCasoController.create
);

/**
 * @swagger
 * /ptCaso/{id}:
 *   put:
 *     summary: Actualizar caso por ID
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del caso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_FISCAL:
 *                 type: integer
 *                 example: 2
 *               CORRELATIVO:
 *                 type: string
 *                 example: "2024-0002"
 *               NOMBRE:
 *                 type: string
 *                 example: "Nuevo nombre de caso"
 *               OBSERVACION:
 *                 type: string
 *                 example: "Nueva observación"
 *               ACTIVO:
 *                 type: boolean
 *                 example: false
 *               ID_ESTADO_CASO:
 *                 type: integer
 *                 example: 2
 *               ID_TIPO_CASO:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Recurso actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 *       404:
 *         description: Recurso no encontrado
 */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptCasoController.update
);

/**
 * @swagger
 * /ptCaso/{id}:
 *   delete:
 *     summary: Eliminar ptCaso por ID
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del recurso
 *     responses:
 *       200:
 *         description: Recurso eliminado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 *       404:
 *         description: Recurso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  ptCasoController.remove
);

/**
 * @swagger
 * /ptCaso/asignarfiscal:
 *   post:
 *     summary: Asignar un fiscal a un caso
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_CASO:
 *                 type: integer
 *               ID_FISCAL:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Fiscal asignado correctamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Conflicto de fiscalía
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/asignarfiscal",
  verifyToken,
  authorizeRoles("ADMINISTRADOR"),
  ptCasoController.asignarFiscal
);

/**
 * @swagger
 * /ptCaso/modificarestado:
 *   post:
 *     summary: Modificar el estado de un caso
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_CASO:
 *                 type: integer
 *               ID_ESTADO_CASO:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Caso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/modificarestado",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptCasoController.modificarEstado
);

/**
 * @swagger
 * /ptCaso/reporte/excel:
 *   post:
 *     summary: Generar reporte de casos en Excel
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fechaInicio
 *               - fechaFin
 *             properties:
 *               fechaInicio:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-01"
 *               fechaFin:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *               estado:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               fiscal:
 *                 type: integer
 *                 nullable: true
 *                 example: 3
 *     responses:
 *       200:
 *         description: Archivo Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Datos inválidos o incompletos
 *       401:
 *         description: Token inválido o no proporcionado
 *       403:
 *         description: Acceso denegado por rol
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/reporte",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptCasoController.reporteExcel
);

/**
 * @swagger
 * /ptCaso/{id}/informe-pdf:
 *   get:
 *     summary: Descargar informe PDF con logs del caso interpretados
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del caso
 *     responses:
 *       200:
 *         description: Archivo PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Caso no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/:id/informe-pdf",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptCasoController.generarInformePDF
);

/**
 * @swagger
 * /ptCaso/resumen:
 *   get:
 *     summary: Obtener resumen de casos (sin asignar, asignados, finalizados)
 *     tags: [PtCaso]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de casos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sinAsignar:
 *                   type: integer
 *                 asignados:
 *                   type: integer
 *                 finalizados:
 *                   type: integer
 *       500:
 *         description: Error del servidor
 */
router.post(
  "/resumen",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptCasoController.resumenCasos
);

module.exports = router;
