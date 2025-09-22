const Cita = require('../models/citaModel');

exports.createCita = async (req, res) => {
    try {
        const { oficinaId, tramiteId, horarioId, fechaCita, horaInicio, horaFin, notas } = req.body;
        const usuarioId = req.userId;
        
        // Validaciones
        if (!oficinaId || !tramiteId || !horarioId || !fechaCita || !horaInicio || !horaFin) {
            return res.status(400).json({ 
                error: 'Todos los campos obligatorios deben ser completados' 
            });
        }
        
        const citaData = {
            usuarioId,
            oficinaId,
            tramiteId,
            horarioId,
            fechaCita,
            horaInicio,
            horaFin,
            notas: notas || null
        };
        
        const citaId = await Cita.createCita(citaData);
        
        res.status(201).json({
            message: 'Cita creada exitosamente',
            citaId
        });
        
    } catch (error) {
        console.error('Error creando cita:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCitasUsuario = async (req, res) => {
    try {
        const usuarioId = req.userId;
        const citas = await Cita.getCitasByUsuario(usuarioId);
        res.json(citas);
    } catch (error) {
        console.error('Error obteniendo citas del usuario:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCitaById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.userId;
        
        const cita = await Cita.getCitaById(id, usuarioId);
        
        if (!cita) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        
        res.json(cita);
    } catch (error) {
        console.error('Error obteniendo cita:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.userId;
        const { horarioId, notas } = req.body;
        
        await Cita.updateCita(id, usuarioId, { horarioId, notas });
        
        res.json({ message: 'Cita actualizada exitosamente' });
    } catch (error) {
        console.error('Error actualizando cita:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.confirmarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.userId;
        
        const confirmada = await Cita.confirmarCita(id, usuarioId);
        
        if (!confirmada) {
            return res.status(400).json({ 
                error: 'No se pudo confirmar la cita. Verifique que la cita existe y está en estado pendiente.' 
            });
        }
        
        res.json({ message: 'Cita confirmada exitosamente' });
    } catch (error) {
        console.error('Error confirmando cita:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.cancelarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.userId;
        const { motivo } = req.body;
        
        await Cita.cancelarCita(id, usuarioId, motivo);
        
        res.json({ message: 'Cita cancelada exitosamente' });
    } catch (error) {
        console.error('Error cancelando cita:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getEstadoCita = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.userId;
        
        const estado = await Cita.getEstadoCita(id, usuarioId);
        
        if (!estado) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }
        
        res.json(estado);
    } catch (error) {
        console.error('Error obteniendo estado de cita:', error);
        res.status(500).json({ error: error.message });
    }
};