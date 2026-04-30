const pool = require('./conexion');

class ParametroRepository {
    async listarTodos() {
        const [filas] = await pool.query("SELECT * FROM parametros WHERE estado = 'ACTIVO'");
        return filas;
    }
    async crear(datos) {
        const { tipo, nombre } = datos;
        const [resultado] = await pool.query("INSERT INTO parametros (tipo, nombre) VALUES (?, ?)", [tipo, nombre]);
        return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
    }
    async actualizar(id, datos) {
        const { tipo, nombre } = datos;
        await pool.query("UPDATE parametros SET tipo = ?, nombre = ? WHERE id = ?", [tipo, nombre, id]);
        return { id, ...datos };
    }
    async eliminar(id) {
        await pool.query("UPDATE parametros SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = ParametroRepository;