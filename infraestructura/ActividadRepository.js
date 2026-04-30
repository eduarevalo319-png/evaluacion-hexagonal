const pool = require('./conexion');

class ActividadRepository {
    async listarTodas() {
        const query = `
            SELECT act.*, a.nombre as asignatura_nombre 
            FROM actividades_academicas act
            INNER JOIN asignaturas a ON act.asignatura_id = a.id
            WHERE act.estado = 'ACTIVO'
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    async obtenerPorId(id) {
        const [filas] = await pool.query("SELECT * FROM actividades_academicas WHERE id = ?", [id]);
        return filas.length > 0 ? filas[0] : null;
    }

    async marcarComoSincronizada(id) {
        await pool.query("UPDATE actividades_academicas SET sincronizada = TRUE WHERE id = ?", [id]);
        return true;
    }

    async crear(datos) {
        const { asignatura_id, nombre, descripcion, caracteristica, id_moodle } = datos;
        const [resultado] = await pool.query(
            "INSERT INTO actividades_academicas (asignatura_id, nombre, descripcion, caracteristica, id_moodle) VALUES (?, ?, ?, ?, ?)",
            [asignatura_id, nombre, descripcion, caracteristica, id_moodle]
        );
        return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
    }

    async actualizar(id, datos) {
        const { asignatura_id, nombre, descripcion, caracteristica, id_moodle } = datos;
        await pool.query(
            "UPDATE actividades_academicas SET asignatura_id = ?, nombre = ?, descripcion = ?, caracteristica = ?, id_moodle = ? WHERE id = ?",
            [asignatura_id, nombre, descripcion, caracteristica, id_moodle, id]
        );
        return { id, ...datos };
    }

    async eliminar(id) {
        await pool.query("UPDATE actividades_academicas SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = ActividadRepository;