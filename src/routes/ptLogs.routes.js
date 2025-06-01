const express = require("express");
const router = express.Router();
const ptLogsController = require("../controllers/ptLogs.controller");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");

/**
 * @swagger
 * /ptLogs:
 *   get:
 *     summary: Obtener todos los registros de PtLogs
 *     tags: [PtLogs]
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
  ptLogsController.getAll
);

/**
 * @swagger
 * /ptLogs/{id}:
 *   get:
 *     summary: Obtener un ptLogs por ID
 *     tags: [PtLogs]
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
  ptLogsController.getById
);

/**
 * @swagger
 * /ptLogs:
 *   post:
 *     summary: Crear nuevo log
 *     tags: [PtLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TABLA:
 *                 type: string
 *                 example: "PT_USUARIO"
 *               IDENTIFICADOR:
 *                 type: integer
 *                 example: 5
 *               ACCION:
 *                 type: string
 *                 example: "CREAR"
 *               DATO_ANTERIOR:
 *                 type: string
 *                 example: null
 *               DATO_POSTERIOR:
 *                 type: string
 *                 example: "{\"USERNAME\":\"nuevo\"}"
 *               ID_USUARIO:
 *                 type: integer
 *                 example: 1
 *               COMENTARIO:
 *                 type: string
 *                 example: "Registro creado por el sistema"
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
  ptLogsController.create
);

/**
 * @swagger
 * /ptLogs/{id}:
 *   put:
 *     summary: Actualizar log por ID
 *     tags: [PtLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del log a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TABLA:
 *                 type: string
 *               IDENTIFICADOR:
 *                 type: integer
 *               ACCION:
 *                 type: string
 *               DATO_ANTERIOR:
 *                 type: string
 *               DATO_POSTERIOR:
 *                 type: string
 *               ID_USUARIO:
 *                 type: integer
 *               COMENTARIO:
 *                 type: string
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
  authorizeRoles("ADMINISTRADOR"),
  ptLogsController.update
);

/**
 * @swagger
 * /ptLogs/{id}:
 *   delete:
 *     summary: Eliminar ptLogs por ID
 *     tags: [PtLogs]
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
  ptLogsController.remove
);

/**
 * @swagger
 * /ptLogs/buscar:
 *   get:
 *     summary: Buscar logs por tabla e identificador
 *     tags: [PtLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tabla
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre de la tabla
 *       - in: path
 *         name: identificador
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del registro
 *     responses:
 *       200:
 *         description: Lista de logs encontrados
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado
 *       500:
 *         description: Error del servidor
 */
router.get(
  "/buscar/:tabla/:identificador",
  verifyToken,
  authorizeRoles("ADMINISTRADOR", "FISCAL"),
  ptLogsController.buscarPorTablaEIdentificador
);

module.exports = router;
