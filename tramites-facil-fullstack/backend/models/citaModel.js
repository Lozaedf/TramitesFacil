const db = require('../config/db');

exports.createCita = async (citaData) => {
    const { usuarioId, oficinaId, tramiteId, horarioId, fechaCita, horaInicio, horaFin, notas } = citaData;
    
    // Iniciar transacción
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Verificar que el horario esté disponible
        const [horario] = await connection.query(
            'SELECT * FROM horarios_disponibles WHERE horario_id = ? AND disponible = TRUE AND reservas_actuales < capacidad_maxima FOR UPDATE',
            [horarioId]
        );
        
        if (!horario.length) {
            throw new Error('El horario seleccionado ya no está disponible');
        }
        
        // Crear la cita
        const [result] = await connection.query(
            'INSERT INTO citas (usuario_id, oficina_id, tramite_id, horario_id, fecha_cita, hora_inicio, hora_fin, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [usuarioId, oficinaId, tramiteId, horarioId, fechaCita, horaInicio, horaFin, notas]
        );
        
        // Actualizar las reservas del horario
        await connection.query(
            'UPDATE horarios_disponibles SET reservas_actuales = reservas_actuales + 1 WHERE horario_id = ?',
            [horarioId]
        );
        
        await connection.commit();
        return result.insertId;
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.getCitasByUsuario = async (usuarioId) => {
    const [rows] = await db.query(`
        SELECT c.*,
               o.nombre as oficina_nombre,
               o.direccion as oficina_direccion,
               t.nombre as tramite_nombre,
               t.descripcion as tramite_descripcion,
               t.duracion_estimada,
               t.costo
        FROM citas c
        JOIN oficinas o ON c.oficina_id = o.oficina_id
        JOIN tramites t ON c.tramite_id = t.tramite_id
        WHERE c.usuario_id = ?
        ORDER BY c.fecha_cita DESC, c.hora_inicio DESC
    `, [usuarioId]);
    return rows;
};

exports.getCitaById = async (citaId, usuarioId = null) => {
    let query = `
        SELECT c.*,
               o.nombre as oficina_nombre,
               o.direccion as oficina_direccion,
               o.telefono as oficina_telefono,
               t.nombre as tramite_nombre,
               t.descripcion as tramite_descripcion,
               t.duracion_estimada,
               t.costo,
               t.documentos_requeridos,
               u.nombre as usuario_nombre,
               u.apellido as usuario_apellido,
               u.email as usuario_email
        FROM citas c
        JOIN oficinas o ON c.oficina_id = o.oficina_id
        JOIN tramites t ON c.tramite_id = t.tramite_id
        JOIN usuarios u ON c.usuario_id = u.usuario_id
        WHERE c.cita_id = ?
    `;
    
    const params = [citaId];
    
    if (usuarioId) {
        query += ' AND c.usuario_id = ?';
        params.push(usuarioId);
    }
    
    const [rows] = await db.query(query, params);
    return rows[0];
};

exports.updateCita = async (citaId, usuarioId, updateData) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Verificar que la cita pertenece al usuario y puede ser modificada
        const [cita] = await connection.query(
            'SELECT * FROM citas WHERE cita_id = ? AND usuario_id = ? AND estado IN ("pendiente", "confirmada") FOR UPDATE',
            [citaId, usuarioId]
        );
        
        if (!cita.length) {
            throw new Error('Cita no encontrada o no puede ser modificada');
        }
        
        const oldHorarioId = cita[0].horario_id;
        const { horarioId, notas } = updateData;
        
        // Si se cambia el horario
        if (horarioId && horarioId !== oldHorarioId) {
            // Verificar disponibilidad del nuevo horario
            const [nuevoHorario] = await connection.query(
                'SELECT * FROM horarios_disponibles WHERE horario_id = ? AND disponible = TRUE AND reservas_actuales < capacidad_maxima FOR UPDATE',
                [horarioId]
            );
            
            if (!nuevoHorario.length) {
                throw new Error('El nuevo horario no está disponible');
            }
            
            // Liberar el horario anterior
            await connection.query(
                'UPDATE horarios_disponibles SET reservas_actuales = reservas_actuales - 1 WHERE horario_id = ?',
                [oldHorarioId]
            );
            
            // Reservar el nuevo horario
            await connection.query(
                'UPDATE horarios_disponibles SET reservas_actuales = reservas_actuales + 1 WHERE horario_id = ?',
                [horarioId]
            );
            
            // Actualizar la cita
            await connection.query(
                'UPDATE citas SET horario_id = ?, fecha_cita = ?, hora_inicio = ?, hora_fin = ?, notas = ? WHERE cita_id = ?',
                [horarioId, nuevoHorario[0].fecha, nuevoHorario[0].hora_inicio, nuevoHorario[0].hora_fin, notas, citaId]
            );
        } else {
            // Solo actualizar notas
            await connection.query(
                'UPDATE citas SET notas = ? WHERE cita_id = ?',
                [notas, citaId]
            );
        }
        
        await connection.commit();
        return true;
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.confirmarCita = async (citaId, usuarioId) => {
    const [result] = await db.query(
        'UPDATE citas SET estado = "confirmada", fecha_confirmacion = NOW() WHERE cita_id = ? AND usuario_id = ? AND estado = "pendiente"',
        [citaId, usuarioId]
    );
    return result.changedRows > 0;
};

exports.cancelarCita = async (citaId, usuarioId, motivoCancelacion) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Obtener la cita
        const [cita] = await connection.query(
            'SELECT * FROM citas WHERE cita_id = ? AND usuario_id = ? AND estado IN ("pendiente", "confirmada") FOR UPDATE',
            [citaId, usuarioId]
        );
        
        if (!cita.length) {
            throw new Error('Cita no encontrada o ya cancelada');
        }
        
        // Cancelar la cita
        await connection.query(
            'UPDATE citas SET estado = "cancelada", fecha_cancelacion = NOW(), motivo_cancelacion = ? WHERE cita_id = ?',
            [motivoCancelacion, citaId]
        );
        
        // Liberar el horario
        await connection.query(
            'UPDATE horarios_disponibles SET reservas_actuales = reservas_actuales - 1 WHERE horario_id = ?',
            [cita[0].horario_id]
        );
        
        await connection.commit();
        return true;
        
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

exports.getEstadoCita = async (citaId, usuarioId) => {
    const [rows] = await db.query(
        'SELECT estado, fecha_cita, hora_inicio FROM citas WHERE cita_id = ? AND usuario_id = ?',
        [citaId, usuarioId]
    );
    return rows[0];
};