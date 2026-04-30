const pool = require('./conexion');

class CursoRepository {
    async listarTodos() {
        // Usamos INNER JOIN para traer también el nombre de la promoción a la que pertenece
        const query = `
            SELECT c.*, p.nombre as promocion_nombre 
            FROM cursos_ascenso c 
            INNER JOIN promociones p ON c.promocion_id = p.id 
            WHERE c.estado = 'ACTIVO'
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    async crear(datos) {
        const { promocion_id, nombre, fecha_inicio, fecha_fin, numero_autorizacion, acta_resolucion_pdf, estado_academico } = datos;
        const [resultado] = await pool.query(
            "INSERT INTO cursos_ascenso (promocion_id, nombre, fecha_inicio, fecha_fin, numero_autorizacion, acta_resolucion_pdf, estado_academico) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [promocion_id, nombre, fecha_inicio, fecha_fin, numero_autorizacion, acta_resolucion_pdf, estado_academico || 'EN ESPERA']
        );
        return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
    }

    async actualizar(id, datos) {
        const { promocion_id, nombre, fecha_inicio, fecha_fin, numero_autorizacion, acta_resolucion_pdf, estado_academico } = datos;
        await pool.query(
            "UPDATE cursos_ascenso SET promocion_id = ?, nombre = ?, fecha_inicio = ?, fecha_fin = ?, numero_autorizacion = ?, acta_resolucion_pdf = ?, estado_academico = ? WHERE id = ?",
            [promocion_id, nombre, fecha_inicio, fecha_fin, numero_autorizacion, acta_resolucion_pdf, estado_academico, id]
        );
        return { id, ...datos };
    }

    async eliminar(id) {
        await pool.query("UPDATE cursos_ascenso SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = CursoRepository;