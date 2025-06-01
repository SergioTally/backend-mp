const express = require("express");
const router = express.Router();
const ptFiscaliaController = require("../controllers/ptFiscalia.controller");
const verifyToken = require("../../middlewares/verifyToken");
const authorizeRoles = require("../../middlewares/authorizeRoles");

/**
 * @swagger
 * /ptFiscalia:
 *   get:
 *     summary: Obtener todos los registros de PtFiscalia
 *     tags: [PtFiscalia]
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
  ptFiscaliaController.getAll
);

/**
 * @swagger
 * /ptFiscalia/{id}:
 *   get:
 *     summary: Obtener un ptFiscalia por ID
 *     tags: [PtFiscalia]
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
  ptFiscaliaController.getById
);

/**
 * @swagger
 * /ptFiscalia:
 *   post:
 *     summary: Crear nueva fiscalía
 *     tags: [PtFiscalia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NOMBRE:
 *                 type: string
 *                 example: Fiscalía Distrital Zona 1
 *               DIRECCION:
 *                 type: string
 *                 example: 6a Avenida 5-40 Zona 1
 *               NUMERO:
 *                 type: string
 *                 example: "22334455"
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
  ptFiscaliaController.create
);

/**
 * @swagger
 * /ptFiscalia/{id}:
 *   put:
 *     summary: Actualizar fiscalía por ID
 *     tags: [PtFiscalia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la fiscalía a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NOMBRE:
 *                 type: string
 *                 example: Fiscalía Distrital Zona 1
 *               DIRECCION:
 *                 type: string
 *                 example: 6a Avenida 5-40 Zona 1
 *               NUMERO:
 *                 type: string
 *                 example: "22334455"
 *               ACTIVO:
 *                 type: boolean
 *                 example: true
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
  ptFiscaliaController.update
);

/**
 * @swagger
 * /ptFiscalia/{id}:
 *   delete:
 *     summary: Eliminar ptFiscalia por ID
 *     tags: [PtFiscalia]
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
  ptFiscaliaController.remove
);

module.exports = router;
