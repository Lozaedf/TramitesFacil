const express = require('express');
const router = express.Router();
const tramiteController = require('../controllers/tramiteController');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Trámites
 *   description: Gestión de trámites
 */

/**
 * @swagger
 * /api/tramites:
 *   get:
 *     summary: Listar todos los trámites
 *     tags: [Trámites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de trámites
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tramite_id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   duracion_estimada:
 *                     type: integer
 *                   documentos_requeridos:
 *                     type: string
 *                   costo:
 *                     type: number
 */
router.get('/', authenticateToken, tramiteController.getAllTramites);

/**
 * @swagger
 * /api/tramites/{id}:
 *   get:
 *     summary: Ver detalle de un trámite
 *     tags: [Trámites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trámite
 *     responses:
 *       200:
 *         description: Detalle del trámite
 *       404:
 *         description: Trámite no encontrado
 */
router.get('/:id', authenticateToken, tramiteController.getTramiteById);

/**
 * @swagger
 * /api/tramites/{id}/disponibilidad:
 *   get:
 *     summary: Ver horarios disponibles por trámite
 *     tags: [Trámites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trámite
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha específica (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Horarios disponibles para el trámite
 */
router.get('/:id/disponibilidad', authenticateToken, tramiteController.getDisponibilidadTramite);

module.exports = router;