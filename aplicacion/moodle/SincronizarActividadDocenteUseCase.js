class SincronizarActividadDocenteUseCase {
    constructor(actividadRepository, calificacionRepository, usuarioRepository, asignaturaRepository, moodleService, emailService) {
        this.actividadRepository = actividadRepository;
        this.calificacionRepository = calificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.asignaturaRepository = asignaturaRepository;
        this.moodleService = moodleService;
        this.emailService = emailService;
    }

    async ejecutar(datos) {
        const { asignatura_id, paralelo_id, actividad_id } = datos;

        if (!asignatura_id || !paralelo_id || !actividad_id) {
            throw new Error("Faltan parámetros: Asignatura, paralelo y actividad son obligatorios.");
        }

        // 1. Validar que la actividad no haya sido sincronizada previamente
        const actividad = await this.actividadRepository.obtenerPorId(actividad_id);
        if (!actividad) throw new Error("La actividad seleccionada no existe en el sistema.");
        
        if (actividad.sincronizada) {
            throw new Error("Esta actividad ya ha sido sincronizada.");
        }

        const asignatura = await this.asignaturaRepository.buscarPorId(asignatura_id);

        // 2. Consumir API de Moodle para obtener las notas registradas
        const notasMoodle = await this.moodleService.obtenerCalificacionesPorActividad(actividad.id_moodle);

        // 3. Almacenar de manera definitiva en el sistema
        let notasGuardadas = 0;
        for (const notaMoodle of notasMoodle) {
            try {
                await this.calificacionRepository.crear({
                    estudiante_id: notaMoodle.estudiante_id,
                    asignatura_id: asignatura_id,
                    paralelo_id: paralelo_id,
                    actividad_id: actividad_id,
                    nota: notaMoodle.nota
                });

                // Enviar correo electrónico al estudiante de forma asíncrona
                const estudiante = await this.usuarioRepository.buscarPorId(notaMoodle.estudiante_id);
                if (estudiante && estudiante.correo) {
                    await this.emailService.enviarNotificacionActividad(estudiante.correo, `${estudiante.nombres} ${estudiante.apellidos}`, asignatura.nombre, actividad.nombre, notaMoodle.nota);
                }
                notasGuardadas++;
            } catch (error) {
                console.error(`⚠️ Nota omitida para estudiante ${notaMoodle.estudiante_id}:`, error.message);
            }
        }

        // 4. Cambiar la bandera a sincronizada para evitar futuras modificaciones
        await this.actividadRepository.marcarComoSincronizada(actividad_id);

        return {
            mensaje: `Sincronización completada. Se guardaron ${notasGuardadas} calificaciones definitivas.`,
            notas_sincronizadas: notasGuardadas
        };
    }
}

module.exports = SincronizarActividadDocenteUseCase;