const pool = require('./conexion');

class SolicitudRepository {
    async listarTodas() {
        const query = `
            SELECT s.*, 
                   c.nota, a.nombre as asignatura_nombre,
                   u.nombres as est_nombres, u.apellidos as est_apellidos, u.cedula
            FROM solicitudes_recalificacion s
            INNER JOIN calificaciones c ON s.calificacion_id = c.id
            INNER JOIN asignaturas a ON c.asignatura_id = a.id
            INNER JOIN usuarios u ON s.estudiante_id = u.id
            ORDER BY s.creado_en DESC
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    async crear(datos) {
        const [resultado] = await pool.query("INSERT INTO solicitudes_recalificacion (calificacion_id, estudiante_id, motivo) VALUES (?, ?, ?)", [datos.calificacion_id, datos.estudiante_id, datos.motivo]);
        return { id: resultado.insertId, ...datos, estado: 'PENDIENTE' };
    }

    async actualizar(id, datos) {
        await pool.query("UPDATE solicitudes_recalificacion SET respuesta = ?, estado = ? WHERE id = ?", [datos.respuesta, datos.estado, id]);
        return { id, ...datos };
    }

    async obtenerDetalleConCorreo(id) {
        const query = `
            SELECT s.motivo, s.respuesta, s.estado, u.correo
            FROM solicitudes_recalificacion s
            INNER JOIN usuarios u ON s.estudiante_id = u.id
            WHERE s.id = ?
        `;
        const [filas] = await pool.query(query, [id]);
        return filas.length > 0 ? filas[0] : null;
    }
}

module.exports = SolicitudRepository;