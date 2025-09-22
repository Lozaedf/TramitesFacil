const express = require('express');
const router = express.Router();
const oficinaController = require('../controllers/oficinaController');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Oficinas
 *   description: Gestión de oficinas
 */

/**
 * @swagger
 * /api/oficinas:
 *   get:
 *     summary: Listar todas las oficinas
 *     tags: [Oficinas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de oficinas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   oficina_id:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   direccion:
 *                     type: string
 *                   telefono:
 *                     type: string
 *                   email:
 *                     type: string
 *                   horario_apertura:
 *                     type: string
 *                   horario_cierre:
 *                     type: string
 *                   total_tramites:
 *                     type: integer
 */
router.get('/', authenticateToken, oficinaController.getAllOficinas);

/**
 * @swagger
 * /api/oficinas/{id}:
 *   get:
 *     summary: Ver detalle de una oficina
 *     tags: [Oficinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oficina
 *     responses:
 *       200:
 *         description: Detalle de la oficina
 *       404:
 *         description: Oficina no encontrada
 */
router.get('/:id', authenticateToken, oficinaController.getOficinaById);

/**
 * @swagger
 * /api/oficinas/{id}/disponibilidad:
 *   get:
 *     summary: Ver horarios y turnos libres de una oficina
 *     tags: [Oficinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oficina
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha específica (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Horarios disponibles
 */
router.get('/:id/disponibilidad', authenticateToken, oficinaController.getDisponibilidadOficina);

/**
 * @swagger
 * /api/oficinas/{id}/horarios:
 *   get:
 *     summary: Listar todos los horarios posibles de la oficina
 *     tags: [Oficinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oficina
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha específica (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Horarios de la oficina
 */
router.get('/:id/horarios', authenticateToken, oficinaController.getHorariosOficina);

/**
 * @swagger
 * /api/oficinas/{id}/horarios/{fecha}:
 *   get:
 *     summary: Ver horarios libres para una fecha específica
 *     tags: [Oficinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oficina
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha específica (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Horarios libres para la fecha
 */
router.get('/:id/horarios/:fecha', authenticateToken, (req, res) => {
    req.query.fecha = req.params.fecha;
    oficinaController.getHorariosOficina(req, res);
});

/**
 * @swagger
 * /api/oficinas/{id}/citas:
 *   get:
 *     summary: Ver todas las citas agendadas en una oficina
 *     tags: [Oficinas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la oficina
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha específica (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Citas de la oficina
 */
router.get('/:id/citas', authenticateToken, oficinaController.getCitasOficina);

module.exports = router;