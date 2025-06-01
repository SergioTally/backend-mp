const express = require("express");
const router = express.Router();
const ptPersonaController = require("../controllers/ptPersona.controller");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");

/**
 * @swagger
 * /ptPersona:
 *   get:
 *     summary: Obtener todos los registros de PtPersona
 *     tags: [PtPersona]
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
  ptPersonaController.getAll
);

/**
 * @swagger
 * /ptPersona/{id}:
 *   get:
 *     summary: Obtener un ptPersona por ID
 *     tags: [PtPersona]
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
  ptPersonaController.getById
);

/**
 * @swagger
 * /ptPersona:
 *   post:
 *     summary: Crear nuevo ptPersona
 *     tags: [PtPersona]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PRIMER_NOMBRE:
 *                 type: string
 *               SEGUNDO_NOMBRE:
 *                 type: string
 *               TERCER_NOMBRE:
 *                 type: string
 *               PRIMER_APELLIDO:
 *                 type: string
 *               SEGUNDO_APELLIDO:
 *                 type: string
 *               APELLIDO_CASADA:
 *                 type: string
 *               DIRECCION:
 *                 type: string
 *               NUMERO:
 *                 type: string
 *               DPI:
 *                 type: string
 *               ACTIVO:
 *                 type: boolean
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
  ptPersonaController.create
);

/**
 * @swagger
 * /ptPersona/{id}:
 *   put:
 *     summary: Actualizar ptPersona por ID
 *     tags: [PtPersona]
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
 *               PRIMER_NOMBRE:
 *                 type: string
 *               SEGUNDO_NOMBRE:
 *                 type: string
 *               TERCER_NOMBRE:
 *                 type: string
 *               PRIMER_APELLIDO:
 *                 type: string
 *               SEGUNDO_APELLIDO:
 *                 type: string
 *               APELLIDO_CASADA:
 *                 type: string
 *               DIRECCION:
 *                 type: string
 *               NUMERO:
 *                 type: string
 *               DPI:
 *                 type: string
 *               ACTIVO:
 *                 type: boolean
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
  ptPersonaController.update
);

/**
 * @swagger
 * /ptPersona/{id}:
 *   delete:
 *     summary: Eliminar ptPersona por ID
 *     tags: [PtPersona]
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
  ptPersonaController.remove
);

module.exports = router;
