const Tramite = require('../models/tramiteModel');

exports.getAllTramites = async (req, res) => {
    try {
        const tramites = await Tramite.getAllTramites();
        res.json(tramites);
    } catch (error) {
        console.error('Error obteniendo trámites:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getTramiteById = async (req, res) => {
    try {
        const { id } = req.params;
        const tramite = await Tramite.getTramiteById(id);
        
        if (!tramite) {
            return res.status(404).json({ error: 'Trámite no encontrado' });
        }
        
        res.json(tramite);
    } catch (error) {
        console.error('Error obteniendo trámite:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getDisponibilidadTramite = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha } = req.query;
        
        const disponibilidad = await Tramite.getDisponibilidadTramite(id, fecha);
        res.json(disponibilidad);
    } catch (error) {
        console.error('Error obteniendo disponibilidad del trámite:', error);
        res.status(500).json({ error: error.message });
    }
};