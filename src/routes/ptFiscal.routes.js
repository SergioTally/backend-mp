const express = require("express");
const router = express.Router();
const ptFiscalController = require("../controllers/ptFiscal.controller");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");

/**
 * @swagger
 * /ptFiscal:
 *   get:
 *     summary: Obtener todos los registros de PtFiscal
 *     tags: [PtFiscal]
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
  ptFiscalController.getAll
);

/**
 * @swagger
 * /ptFiscal/{id}:
 *   get:
 *     summary: Obtener un ptFiscal por ID
 *     tags: [PtFiscal]
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
  ptFiscalController.getById
);

/**
 * @swagger
 * /ptFiscal:
 *   post:
 *     summary: Crear nuevo fiscal
 *     tags: [PtFiscal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ID_PERSONA
 *             properties:
 *               ID_PERSONA:
 *                 type: integer
 *                 example: 10
 *               ID_FISCALIA:
 *                 type: integer
 *                 example: 5
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
  ptFiscalController.create
);

/**
 * @swagger
 * /ptFiscal/{id}:
 *   put:
 *     summary: Actualizar fiscal por ID
 *     tags: [PtFiscal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del fiscal a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ID_PERSONA:
 *                 type: integer
 *                 example: 10
 *               ID_FISCALIA:
 *                 type: integer
 *                 example: 5
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
  ptFiscalController.update
);

/**
 * @swagger
 * /ptFiscal/{id}:
 *   delete:
 *     summary: Eliminar ptFiscal por ID
 *     tags: [PtFiscal]
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
  ptFiscalController.remove
);

module.exports = router;
