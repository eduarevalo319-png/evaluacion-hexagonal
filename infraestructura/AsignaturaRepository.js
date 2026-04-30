const pool = require('./conexion');

class AsignaturaRepository {
    async listarTodas() {
        const [filas] = await pool.query("SELECT * FROM asignaturas WHERE estado = 'ACTIVO'");
        return filas;
    }
    async buscarPorId(id) {
        const [filas] = await pool.query("SELECT * FROM asignaturas WHERE id = ?", [id]);
        return filas.length > 0 ? filas[0] : null;
    }
    async crear(datos) {
        const [resultado] = await pool.query("INSERT INTO asignaturas (nombre) VALUES (?)", [datos.nombre]);
        return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
    }
    async actualizar(id, datos) {
        await pool.query("UPDATE asignaturas SET nombre = ? WHERE id = ?", [datos.nombre, id]);
        return { id, ...datos };
    }
    async eliminar(id) {
        await pool.query("UPDATE asignaturas SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = AsignaturaRepository;