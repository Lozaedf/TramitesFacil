const db = require('../config/db');

exports.getAllTramites = async () => {
    const [rows] = await db.query('SELECT * FROM tramites WHERE activo = TRUE ORDER BY nombre');
    return rows;
};

exports.getTramiteById = async (id) => {
    const [rows] = await db.query('SELECT * FROM tramites WHERE tramite_id = ? AND activo = TRUE', [id]);
    return rows[0];
};

exports.getDisponibilidadTramite = async (tramiteId, fecha = null) => {
    let query = `
        SELECT h.*,
               o.nombre as oficina_nombre,
               o.direccion as oficina_direccion,
               (h.capacidad_maxima - h.reservas_actuales) as espacios_disponibles
        FROM horarios_disponibles h
        JOIN oficinas o ON h.oficina_id = o.oficina_id
        JOIN oficina_tramites ot ON o.oficina_id = ot.oficina_id 
        WHERE ot.tramite_id = ?
          AND ot.disponible = TRUE
          AND o.activa = TRUE
          AND h.disponible = TRUE
          AND h.reservas_actuales < h.capacidad_maxima
    `;
    
    const params = [tramiteId];
    
    if (fecha) {
        query += ' AND h.fecha = ?';
        params.push(fecha);
    } else {
        query += ' AND h.fecha >= CURDATE()';
    }
    
    query += ' ORDER BY h.fecha, h.hora_inicio';
    
    const [rows] = await db.query(query, params);
    return rows;
};