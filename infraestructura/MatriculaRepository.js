const pool = require('./conexion');

class MatriculaRepository {
    async listarTodas() {
        const query = `
            SELECT m.id, m.paralelo_id, p.nombre as paralelo_nombre, c.nombre as curso_nombre,
                   m.estudiante_id, u.nombres, u.apellidos, u.cedula
            FROM matriculas m
            INNER JOIN paralelos p ON m.paralelo_id = p.id
            INNER JOIN cursos_ascenso c ON p.curso_id = c.id
            INNER JOIN usuarios u ON m.estudiante_id = u.id
            WHERE m.estado = 'ACTIVO'
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    async crear(datos) {
        const { paralelo_id, estudiante_id } = datos;
        const [existe] = await pool.query("SELECT id FROM matriculas WHERE paralelo_id = ? AND estudiante_id = ? AND estado = 'ACTIVO'", [paralelo_id, estudiante_id]);
        if (existe.length > 0) throw new Error("El estudiante ya se encuentra matriculado en este paralelo.");

        const [resultado] = await pool.query("INSERT INTO matriculas (paralelo_id, estudiante_id) VALUES (?, ?)", [paralelo_id, estudiante_id]);
        return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
    }

    async eliminar(id) {
        await pool.query("UPDATE matriculas SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = MatriculaRepository;