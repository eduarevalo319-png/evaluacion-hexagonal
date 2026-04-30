const pool = require('./conexion');

class AsignacionDocenteRepository {
    async listarTodas() {
        const query = `
            SELECT a.id, 
                   a.paralelo_id, p.nombre as paralelo_nombre, c.nombre as curso_nombre,
                   a.asignatura_id, asig.nombre as asignatura_nombre,
                   a.docente_id, u.nombres, u.apellidos, u.cedula
            FROM asignacion_docentes a
            INNER JOIN paralelos p ON a.paralelo_id = p.id
            INNER JOIN cursos_ascenso c ON p.curso_id = c.id
            INNER JOIN asignaturas asig ON a.asignatura_id = asig.id
            INNER JOIN usuarios u ON a.docente_id = u.id
            WHERE a.estado = 'ACTIVO'
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    async crear(datos) {
        const { paralelo_id, asignatura_id, docente_id } = datos;
        
        // Verificamos si en este paralelo ya alguien está dando esta materia
        const [existe] = await pool.query("SELECT id FROM asignacion_docentes WHERE paralelo_id = ? AND asignatura_id = ? AND estado = 'ACTIVO'", [paralelo_id, asignatura_id]);
        if (existe.length > 0) throw new Error("Esta asignatura ya tiene un docente asignado en este paralelo.");

        const [resultado] = await pool.query("INSERT INTO asignacion_docentes (paralelo_id, asignatura_id, docente_id) VALUES (?, ?, ?)", [paralelo_id, asignatura_id, docente_id]);
        return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
    }

    async eliminar(id) {
        await pool.query("UPDATE asignacion_docentes SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = AsignacionDocenteRepository;