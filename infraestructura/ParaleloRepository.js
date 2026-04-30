const pool = require('./conexion');

class ParaleloRepository {
    async listarTodos() {
        const query = `
            SELECT p.*, c.nombre as curso_nombre 
            FROM paralelos p 
            INNER JOIN cursos_ascenso c ON p.curso_id = c.id 
            WHERE p.estado = 'ACTIVO'
        `;
        const [filas] = await pool.query(query);
        return filas;
    }
    async crear(datos) {
        const [resultado] = await pool.query(
            "INSERT INTO paralelos (curso_id, nombre) VALUES (?, ?)", [datos.curso_id, datos.nombre]
        );
        return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
    }
    async actualizar(id, datos) {
        await pool.query("UPDATE paralelos SET curso_id = ?, nombre = ? WHERE id = ?", [datos.curso_id, datos.nombre, id]);
        return { id, ...datos };
    }
    async eliminar(id) {
        await pool.query("UPDATE paralelos SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = ParaleloRepository;