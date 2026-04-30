const pool = require('./conexion');

class CalificacionRepository {
    async listarTodas() {
        const query = `
            SELECT c.id, c.nota,
                   c.estudiante_id, u.nombres as est_nombres, u.apellidos as est_apellidos, u.cedula,
                   c.asignatura_id, a.nombre as asignatura_nombre,
                   c.paralelo_id, p.nombre as paralelo_nombre, cur.nombre as curso_nombre,
                   c.actividad_id, act.nombre as actividad_nombre,
                   c.observacion
            FROM calificaciones c
            INNER JOIN usuarios u ON c.estudiante_id = u.id
            INNER JOIN asignaturas a ON c.asignatura_id = a.id
            INNER JOIN paralelos p ON c.paralelo_id = p.id
            INNER JOIN cursos_ascenso cur ON p.curso_id = cur.id
            LEFT JOIN actividades_academicas act ON c.actividad_id = act.id
            WHERE c.estado = 'ACTIVO'
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    // Nueva función para traer los datos puros para el motor de cálculos
    async obtenerTodasLasNotas() {
        const query = `
            SELECT c.nota, c.estudiante_id, u.cedula, u.nombres, u.apellidos, cur.nombre as curso_nombre
            FROM calificaciones c
            INNER JOIN usuarios u ON c.estudiante_id = u.id
            INNER JOIN paralelos p ON c.paralelo_id = p.id
            INNER JOIN cursos_ascenso cur ON p.curso_id = cur.id
            WHERE c.estado = 'ACTIVO'
        `;
        const [filas] = await pool.query(query);
        return filas;
    }

    async crear(datos) {
        const { estudiante_id, asignatura_id, paralelo_id, actividad_id, nota } = datos;
        
        let queryExiste;
        let paramsExiste;

        if (actividad_id) {
            queryExiste = "SELECT id FROM calificaciones WHERE estudiante_id = ? AND actividad_id = ? AND estado = 'ACTIVO'";
            paramsExiste = [estudiante_id, actividad_id];
        } else {
            queryExiste = "SELECT id FROM calificaciones WHERE estudiante_id = ? AND asignatura_id = ? AND paralelo_id = ? AND actividad_id IS NULL AND estado = 'ACTIVO'";
            paramsExiste = [estudiante_id, asignatura_id, paralelo_id];
        }

        const [existe] = await pool.query(queryExiste, paramsExiste);
        if (existe.length > 0) throw new Error("El estudiante ya tiene una calificación registrada en esta asignatura y paralelo.");

        const [resultado] = await pool.query("INSERT INTO calificaciones (estudiante_id, asignatura_id, paralelo_id, actividad_id, nota) VALUES (?, ?, ?, ?, ?)", [estudiante_id, asignatura_id, paralelo_id, actividad_id || null, nota]);
        return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
    }

    async guardarPromedio(datos) {
        const { estudiante_id, asignatura_id, paralelo_id, nota, observacion } = datos;
        const [resultado] = await pool.query("INSERT INTO calificaciones (estudiante_id, asignatura_id, paralelo_id, actividad_id, nota, observacion) VALUES (?, ?, ?, NULL, ?, ?)", [estudiante_id, asignatura_id, paralelo_id, nota, observacion]);
        return { id: resultado.insertId };
    }

    async actualizar(id, datos) {
        const { nota_nueva, usuario_id, motivo } = datos;
        
        // 1. Obtener la nota anterior antes de que se pierda
        const [rows] = await pool.query("SELECT nota FROM calificaciones WHERE id = ?", [id]);
        if (rows.length === 0) throw new Error("Calificación no encontrada");
        const nota_anterior = rows[0].nota;

        // 2. Actualizar la nota en la tabla principal
        await pool.query("UPDATE calificaciones SET nota = ? WHERE id = ?", [nota_nueva, id]);

        // 3. Dejar la huella imborrable en la tabla de auditoría
        await pool.query("INSERT INTO auditoria_calificaciones (calificacion_id, usuario_id, nota_anterior, nota_nueva, motivo) VALUES (?, ?, ?, ?, ?)", [id, usuario_id, nota_anterior, nota_nueva, motivo]);

        return { id, nota_nueva };
    }

    async eliminar(id) {
        await pool.query("UPDATE calificaciones SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = CalificacionRepository;