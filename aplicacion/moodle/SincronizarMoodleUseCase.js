class SincronizarMoodleUseCase {
    constructor(moodleService, calificacionRepository) {
        this.moodleService = moodleService;
        this.calificacionRepository = calificacionRepository;
    }

    async ejecutar() {
        console.log("🔄 [Sincronizador] Iniciando sincronización automática con Moodle...");
        
        // 1. Traer datos de Moodle
        const notasNuevas = await this.moodleService.obtenerCalificacionesRecientes();

        if (notasNuevas.length === 0) {
            console.log("ℹ️ [Sincronizador] No hay notas nuevas para sincronizar hoy.");
            return;
        }

        // 2. Procesar y guardar en nuestra base de datos
        let insertadas = 0;
        for (const nota of notasNuevas) {
            try {
                // Intentamos guardar la nota en MySQL. 
                // Si ya existe (mismo alumno, misma materia, mismo paralelo), el repositorio lanzará error y pasará al siguiente.
                await this.calificacionRepository.crear({
                    estudiante_id: nota.estudiante_id,
                    asignatura_id: nota.asignatura_id,
                    paralelo_id: nota.paralelo_id,
                    nota: nota.nota
                });
                insertadas++;
            } catch (error) {
                // Si hay error (como duplicado), lo ignoramos silenciosamente en el log automático
            }
        }

        console.log(`✅ [Sincronizador] Sincronización finalizada. Se guardaron ${insertadas} calificaciones nuevas.`);
    }
}

module.exports = SincronizarMoodleUseCase;