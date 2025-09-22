const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const authenticateToken = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Citas
 *   description: Gestión de citas de usuario
 */

/**
 * @swagger
 * /api/citas:
 *   post:
 *     summary: Crear una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oficinaId
 *               - tramiteId
 *               - horarioId
 *               - fechaCita
 *               - horaInicio
 *               - horaFin
 *             properties:
 *               oficinaId:
 *                 type: integer
 *                 description: ID de la oficina
 *               tramiteId:
 *                 type: integer
 *                 description: ID del trámite
 *               horarioId:
 *                 type: integer
 *                 description: ID del horario seleccionado
 *               fechaCita:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la cita
 *               horaInicio:
 *                 type: string
 *                 format: time
 *                 description: Hora de inicio
 *               horaFin:
 *                 type: string
 *                 format: time
 *                 description: Hora de fin
 *               notas:
 *                 type: string
 *                 description: Notas adicionales
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', authenticateToken, citaController.createCita);

/**
 * @swagger
 * /api/citas:
 *   get:
 *     summary: Listar todas mis citas
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cita_id:
 *                     type: integer
 *                   fecha_cita:
 *                     type: string
 *                     format: date
 *                   hora_inicio:
 *                     type: string
 *                     format: time
 *                   hora_fin:
 *                     type: string
 *                     format: time
 *                   estado:
 *                     type: string
 *                     enum: [pendiente, confirmada, cancelada, completada, no_asistio]
 *                   oficina_nombre:
 *                     type: string
 *                   tramite_nombre:
 *                     type: string
 */
router.get('/', authenticateToken, citaController.getCitasUsuario);

/**
 * @swagger
 * /api/citas/{id}:
 *   get:
 *     summary: Ver detalle de una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Detalle de la cita
 *       404:
 *         description: Cita no encontrada
 */
router.get('/:id', authenticateToken, citaController.getCitaById);

/**
 * @swagger
 * /api/citas/{id}:
 *   put:
 *     summary: Modificar cita (reagendar, cambiar trámite, etc.)
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horarioId:
 *                 type: integer
 *                 description: Nuevo ID del horario
 *               notas:
 *                 type: string
 *                 description: Notas adicionales
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *       400:
 *         description: Error en la actualización
 */
router.put('/:id', authenticateToken, citaController.updateCita);

/**
 * @swagger
 * /api/citas/{id}/confirmar:
 *   put:
 *     summary: Confirmar asistencia
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Cita confirmada exitosamente
 *       400:
 *         description: No se pudo confirmar la cita
 */
router.put('/:id/confirmar', authenticateToken, citaController.confirmarCita);

/**
 * @swagger
 * /api/citas/{id}:
 *   delete:
 *     summary: Cancelar cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivo:
 *                 type: string
 *                 description: Motivo de la cancelación
 *     responses:
 *       200:
 *         description: Cita cancelada exitosamente
 *       404:
 *         description: Cita no encontrada
 */
router.delete('/:id', authenticateToken, citaController.cancelarCita);

/**
 * @swagger
 * /api/citas/{id}/estado:
 *   get:
 *     summary: Ver estado de una cita
 *     tags: [Citas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Estado de la cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: string
 *                   enum: [pendiente, confirmada, cancelada, completada, no_asistio]
 *                 fecha_cita:
 *                   type: string
 *                   format: date
 *                 hora_inicio:
 *                   type: string
 *                   format: time
 *       404:
 *         description: Cita no encontrada
 */
router.get('/:id/estado', authenticateToken, citaController.getEstadoCita);

module.exports = router;