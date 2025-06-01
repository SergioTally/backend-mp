const express = require("express");
const router = express.Router();
const ptUsuarioController = require("../controllers/ptUsuario.controller");
const verifyToken = require('../../middlewares/verifyToken');
const authorizeRoles = require('../../middlewares/authorizeRoles');

/**
 * @swagger
 * /ptusuario:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [PT_USUARIO]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 *       500:
 *         description: Error del servidor
 */
router.get("/", verifyToken, authorizeRoles('ADMINISTRADOR', "FISCAL"), ptUsuarioController.getAll);

/**
 * @swagger
 * /ptusuario/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [PT_USUARIO]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", verifyToken, authorizeRoles('ADMINISTRADOR', "FISCAL"), ptUsuarioController.getById);

/**
 * @swagger
 * /ptusuario:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [PT_USUARIO]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               USERNAME:
 *                 type: string
 *               PASSWORD:
 *                 type: string
 *               ACTIVO:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 */
router.post("/", verifyToken, authorizeRoles('ADMINISTRADOR'), ptUsuarioController.create);

/**
 * @swagger
 * /ptusuario/{id}:
 *   put:
 *     summary: Actualizar usuario por ID
 *     tags: [PT_USUARIO]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               USERNAME:
 *                 type: string
 *               PASSWORD:
 *                 type: string
 *               ACTIVO:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", verifyToken, authorizeRoles('ADMINISTRADOR'), ptUsuarioController.update);

/**
 * @swagger
 * /ptusuario/{id}:
 *   delete:
 *     summary: Eliminar usuario por ID
 *     tags: [PT_USUARIO]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Acceso denegado por rol
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", verifyToken, authorizeRoles('ADMINISTRADOR'), ptUsuarioController.remove);

module.exports = router;
