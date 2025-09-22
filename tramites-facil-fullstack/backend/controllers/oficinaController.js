const Oficina = require('../models/oficinaModel');

exports.getAllOficinas = async (req, res) => {
    try {
        const oficinas = await Oficina.getAllOficinas();
        res.json(oficinas);
    } catch (error) {
        console.error('Error obteniendo oficinas:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getOficinaById = async (req, res) => {
    try {
        const { id } = req.params;
        const oficina = await Oficina.getOficinaById(id);
        
        if (!oficina) {
            return res.status(404).json({ error: 'Oficina no encontrada' });
        }
        
        // Parsear los trámites disponibles
        if (oficina.tramites_disponibles) {
            try {
                oficina.tramites_disponibles = JSON.parse(`[${oficina.tramites_disponibles}]`);
            } catch (e) {
                oficina.tramites_disponibles = [];
            }
        } else {
            oficina.tramites_disponibles = [];
        }
        
        res.json(oficina);
    } catch (error) {
        console.error('Error obteniendo oficina:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getDisponibilidadOficina = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha } = req.query;
        
        const disponibilidad = await Oficina.getDisponibilidadOficina(id, fecha);
        res.json(disponibilidad);
    } catch (error) {
        console.error('Error obteniendo disponibilidad:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getHorariosOficina = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha } = req.query;
        
        const horarios = await Oficina.getDisponibilidadOficina(id, fecha);
        res.json(horarios);
    } catch (error) {
        console.error('Error obteniendo horarios:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCitasOficina = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha } = req.query;
        
        const citas = await Oficina.getCitasOficina(id, fecha);
        res.json(citas);
    } catch (error) {
        console.error('Error obteniendo citas de oficina:', error);
        res.status(500).json({ error: error.message });
    }
};