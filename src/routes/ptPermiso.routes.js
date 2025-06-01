const express = require("express");
const router = express.Router();
const ptPermisoController = require("../controllers/ptPermiso.controller");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");

/**
 * @swagger
 * /ptPermiso:
 *   get:
 *     summary: Obtener todos los registros de PtPermiso
 *     tags: [PtPermiso]
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
  ptPermisoController.getAll
);

/**
 * @swagger
 * /ptPermiso/{id}:
 *   get:
 *     summary: Obtener un ptPermiso por ID
 *     tags: [PtPermiso]
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
  ptPermisoController.getById
);

/**
 * @swagger
 * /ptPermiso:
 *   post:
 *     summary: Crear nuevo ptPermiso
 *     tags: [PtPermiso]
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
 *                 example: Ver Reportes
 *               ACTIVO:
 *                 type: string
 *                 maxLength: 10
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
  ptPermisoController.create
);

/**
 * @swagger
 * /ptPermiso/{id}:
 *   put:
 *     summary: Actualizar ptPermiso por ID
 *     tags: [PtPermiso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del permiso a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NOMBRE:
 *                 type: string
 *                 example: Modificar Casos
 *               ACTIVO:
 *                 type: string
 *                 maxLength: 10
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
  ptPermisoController.update
);

/**
 * @swagger
 * /ptPermiso/{id}:
 *   delete:
 *     summary: Eliminar ptPermiso por ID
 *     tags: [PtPermiso]
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
  ptPermisoController.remove
);

module.exports = router;
