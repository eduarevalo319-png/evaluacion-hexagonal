const pool = require('./conexion');

class AuditoriaRepository {
    async listarTodas() {
        const query = `
            SELECT a.id, a.nota_anterior, a.nota_nueva, a.motivo, a.fecha,
                   u.nombres as admin_nombres, u.apellidos as admin_apellidos, u.cedula as admin_cedula,
                   e.nombres as est_nombres, e.apellidos as est_apellidos,
                   asig.nombre as asignatura_nombre
            FROM auditoria_calificaciones a
            INNER JOIN usuarios u ON a.usuario_id = u.id
            INNER JOIN calificaciones c ON a.calificacion_id = c.id
            INNER JOIN usuarios e ON c.estudiante_id = e.id
            INNER JOIN asignaturas asig ON c.asignatura_id = asig.id
            ORDER BY a.fecha DESC
        `;
        const [filas] = await pool.query(query);
        return filas;
    }
}

module.exports = AuditoriaRepository;