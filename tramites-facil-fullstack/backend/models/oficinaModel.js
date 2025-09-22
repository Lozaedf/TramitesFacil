const db = require('../config/db');

exports.getAllOficinas = async () => {
    const [rows] = await db.query(`
        SELECT o.*, 
               COUNT(DISTINCT ot.tramite_id) as total_tramites
        FROM oficinas o
        LEFT JOIN oficina_tramites ot ON o.oficina_id = ot.oficina_id AND ot.disponible = TRUE
        WHERE o.activa = TRUE
        GROUP BY o.oficina_id
        ORDER BY o.nombre
    `);
    return rows;
};

exports.getOficinaById = async (id) => {
    const [rows] = await db.query(`
        SELECT o.*,
               GROUP_CONCAT(
                   JSON_OBJECT(
                       'tramite_id', t.tramite_id,
                       'nombre', t.nombre,
                       'descripcion', t.descripcion,
                       'duracion_estimada', t.duracion_estimada,
                       'costo', t.costo
                   )
               ) as tramites_disponibles
        FROM oficinas o
        LEFT JOIN oficina_tramites ot ON o.oficina_id = ot.oficina_id AND ot.disponible = TRUE
        LEFT JOIN tramites t ON ot.tramite_id = t.tramite_id AND t.activo = TRUE
        WHERE o.oficina_id = ? AND o.activa = TRUE
        GROUP BY o.oficina_id
    `, [id]);
    return rows[0];
};

exports.getDisponibilidadOficina = async (oficinaId, fecha = null) => {
    let query = `
        SELECT h.*,
               (h.capacidad_maxima - h.reservas_actuales) as espacios_disponibles,
               CASE 
                   WHEN h.disponible = TRUE AND h.reservas_actuales < h.capacidad_maxima 
                   THEN 'disponible'
                   ELSE 'ocupado'
               END as estado
        FROM horarios_disponibles h
        WHERE h.oficina_id = ?
    `;
    
    const params = [oficinaId];
    
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

exports.getCitasOficina = async (oficinaId, fecha = null) => {
    let query = `
        SELECT c.*,
               u.nombre as usuario_nombre,
               u.apellido as usuario_apellido,
               u.email as usuario_email,
               t.nombre as tramite_nombre,
               t.duracion_estimada
        FROM citas c
        JOIN usuarios u ON c.usuario_id = u.usuario_id
        JOIN tramites t ON c.tramite_id = t.tramite_id
        WHERE c.oficina_id = ?
    `;
    
    const params = [oficinaId];
    
    if (fecha) {
        query += ' AND c.fecha_cita = ?';
        params.push(fecha);
    }
    
    query += ' ORDER BY c.fecha_cita, c.hora_inicio';
    
    const [rows] = await db.query(query, params);
    return rows;
};