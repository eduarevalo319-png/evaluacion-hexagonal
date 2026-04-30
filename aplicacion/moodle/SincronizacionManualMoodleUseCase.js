class SincronizacionManualMoodleUseCase {
    constructor(moodleService) {
        this.moodleService = moodleService;
        // En un entorno de producción avanzado, aquí inyectarías los repositorios
        // (ej. calificacionRepository, matriculaRepository) para guardar los datos.
    }

    async ejecutar(parametros) {
        const { promocion_id, tipo_recurso, id_moodle } = parametros;

        if (!promocion_id || !tipo_recurso || !id_moodle) {
            throw new Error("Faltan parámetros obligatorios para ejecutar la sincronización manual.");
        }

        console.log(`🔄 [Moodle Sync Manual] Iniciando... Promoción: ${promocion_id} | Recurso: ${tipo_recurso} | ID: ${id_moodle}`);

        // Simulamos el tiempo de espera de una conexión real por red
        await new Promise(resolve => setTimeout(resolve, 1500));

        const reporte = [];

        // Aquí es donde llamarías a diferentes métodos de this.moodleService según el tipo
        // y luego guardarías los datos con tus Repositorios. Por ahora, generamos el reporte simulado:
        switch (tipo_recurso) {
            case 'ESTUDIANTES':
                reporte.push({ id_moodle: id_moodle, tipo_recurso: 'Estudiantes', descripcion: `Se importaron 45 estudiantes matriculados desde el curso ${id_moodle} de Moodle.`, caracteristica: 'N/A', estado: 'COMPLETADO' });
                break;
            case 'CURSOS':
                reporte.push({ id_moodle: id_moodle, tipo_recurso: 'Cursos', descripcion: `Sincronización de estructura del curso con ID ${id_moodle}.`, caracteristica: 'N/A', estado: 'COMPLETADO' });
                break;
            case 'ACTIVIDADES':
                reporte.push({ id_moodle: `${id_moodle}-1`, tipo_recurso: 'Actividad', descripcion: 'Tarea 1: Ensayo de Liderazgo', caracteristica: 'CUALITATIVA', estado: 'AGREGADO' });
                reporte.push({ id_moodle: `${id_moodle}-2`, tipo_recurso: 'Actividad', descripcion: 'Examen Final Teórico', caracteristica: 'CUANTITATIVA', estado: 'AGREGADO' });
                break;
            case 'CALIFICACIONES':
                // Reutilizamos el servicio que ya tienes creado
                const notasNuevas = await this.moodleService.obtenerCalificacionesRecientes();
                reporte.push({ id_moodle: id_moodle, tipo_recurso: 'Calificaciones', descripcion: `Se descargaron ${notasNuevas.length} calificaciones nuevas.`, caracteristica: 'CUANTITATIVA', estado: 'COMPLETADO' });
                break;
            default:
                throw new Error("Tipo de recurso no reconocido por el sistema.");
        }

        console.log(`✅ [Moodle Sync Manual] Sincronización de ${tipo_recurso} completada.`);
        
        // Devolvemos el array que llenará la tabla "Reporte de Resultados" en Angular
        return reporte;
    }
}

module.exports = SincronizacionManualMoodleUseCase;