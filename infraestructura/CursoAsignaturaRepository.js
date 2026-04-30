const pool = require('./conexion');

class CursoAsignaturaRepository {
    async listarTodas() {
        const query = `
            SELECT ca.id,
                   ca.curso_id, c.nombre as curso_nombre,
                   ca.asignatura_id, a.nombre as asignatura_nombre
            FROM curso_asignaturas ca
            INNER JOIN cursos_ascenso c ON ca.curso_id = c.id
            INNER JOIN asignaturas a ON ca.asignatura_id = a.id
            WHERE ca.estado = 'ACTIVO'
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    async crear(datos) {
        const { curso_id, asignatura_id } = datos;
        const [resultado] = await pool.query("INSERT INTO curso_asignaturas (curso_id, asignatura_id) VALUES (?, ?)", [curso_id, asignatura_id]);
        return { id: resultado.insertId, ...datos };
    }

    async eliminar(id) {
        await pool.query("UPDATE curso_asignaturas SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = CursoAsignaturaRepository;