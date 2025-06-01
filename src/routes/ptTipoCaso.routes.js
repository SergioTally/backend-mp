const express = require("express");
const router = express.Router();
const ptTipoCasoController = require("../controllers/ptTipoCaso.controller");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");

/**
 * @swagger
 * /ptTipoCaso:
 *   get:
 *     summary: Obtener todos los registros de PtTipoCaso
 *     tags: [PtTipoCaso]
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
  ptTipoCasoController.getAll
);

/**
 * @swagger
 * /ptTipoCaso/{id}:
 *   get:
 *     summary: Obtener un ptTipoCaso por ID
 *     tags: [PtTipoCaso]
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
  ptTipoCasoController.getById
);

/**
 * @swagger
 * /ptTipoCaso:
 *   post:
 *     summary: Crear nuevo ptTipoCaso
 *     tags: [PtTipoCaso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - NOMBRE
 *               - ACTIVO
 *             properties:
 *               NOMBRE:
 *                 type: string
 *                 example: "Violencia intrafamiliar"
 *               ACTIVO:
 *                 type: boolean
 *                 example: true
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
  ptTipoCasoController.create
);

/**
 * @swagger
 * /ptTipoCaso/{id}:
 *   put:
 *     summary: Actualizar ptTipoCaso por ID
 *     tags: [PtTipoCaso]
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
 *             properties:
 *               NOMBRE:
 *                 type: string
 *                 example: "Penal"
 *               ACTIVO:
 *                 type: boolean
 *                 example: false
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
  ptTipoCasoController.update
);

/**
 * @swagger
 * /ptTipoCaso/{id}:
 *   delete:
 *     summary: Eliminar ptTipoCaso por ID
 *     tags: [PtTipoCaso]
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
  ptTipoCasoController.remove
);

module.exports = router;
