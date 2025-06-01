const express = require("express");
const router = express.Router();
const ptEstadoCasoController = require("../controllers/ptEstadoCaso.controller");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");

/**
 * @swagger
 * /ptEstadoCaso:
 *   get:
 *     summary: Obtener todos los registros de PtEstadoCaso
 *     tags: [PtEstadoCaso]
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
  ptEstadoCasoController.getAll
);

/**
 * @swagger
 * /ptEstadoCaso/{id}:
 *   get:
 *     summary: Obtener un ptEstadoCaso por ID
 *     tags: [PtEstadoCaso]
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
  ptEstadoCasoController.getById
);

/**
 * @swagger
 * /ptEstadoCaso:
 *   post:
 *     summary: Crear nuevo ptEstadoCaso
 *     tags: [PtEstadoCaso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
  ptEstadoCasoController.create
);

/**
 * @swagger
 * /ptEstadoCaso/{id}:
 *   put:
 *     summary: Actualizar ptEstadoCaso por ID
 *     tags: [PtEstadoCaso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del recurso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
  ptEstadoCasoController.update
);

/**
 * @swagger
 * /ptEstadoCaso/{id}:
 *   delete:
 *     summary: Eliminar ptEstadoCaso por ID
 *     tags: [PtEstadoCaso]
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
  ptEstadoCasoController.remove
);

module.exports = router;
