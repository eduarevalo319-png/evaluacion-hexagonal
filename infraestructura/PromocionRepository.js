const pool = require('./conexion');

class PromocionRepository {
    // Obtener todas las promociones activas
    async listarTodas() {
        const [filas] = await pool.query("SELECT * FROM promociones WHERE estado = 'ACTIVO'");
        return filas;
    }

    // Guardar una nueva promoción en la base de datos
    async crear(datos) {
        const { nombre, anio } = datos;
        const [resultado] = await pool.query(
            "INSERT INTO promociones (nombre, anio) VALUES (?, ?)",
            [nombre, anio]
        );
        return { id: resultado.insertId, nombre, anio, estado: 'ACTIVO' };
    }

    // Actualizar una promoción existente
    async actualizar(id, datos) {
        const { nombre, anio } = datos;
        await pool.query(
            "UPDATE promociones SET nombre = ?, anio = ? WHERE id = ?",
            [nombre, anio, id]
        );
        return { id, nombre, anio };
    }

    // Eliminación lógica (Cambiar a INACTIVO)
    async eliminar(id) {
        await pool.query("UPDATE promociones SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = PromocionRepository;