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
  authorizeRoles("ADMINISTRADOR"),
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
  authorizeRoles("ADMINISTRADOR"),
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
  authorizeRoles("ADMINISTRADOR"),
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
  authorizeRoles("ADMINISTRADOR"),
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

module.exports = router;
