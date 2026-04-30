class ModificarCalificacionDocenteUseCase {
    constructor(calificacionRepository, actividadRepository, usuarioRepository, asignaturaRepository, asignacionDocenteRepository, emailService) {
        this.calificacionRepository = calificacionRepository;
        this.actividadRepository = actividadRepository;
        this.usuarioRepository = usuarioRepository;
        this.asignaturaRepository = asignaturaRepository;
        this.asignacionDocenteRepository = asignacionDocenteRepository;
        this.emailService = emailService;
    }

    async ejecutar(datos) {
        const { calificacion_id, nota_nueva, observacion, docente_id } = datos;

        if (!calificacion_id || nota_nueva === undefined || !observacion || !docente_id) {
            throw new Error("Faltan parámetros obligatorios para modificar la nota.");
        }

        // 1. Obtener la calificación actual para conocer la nota anterior y el ID del estudiante
        const calificaciones = await this.calificacionRepository.listarTodas();
        const calActual = calificaciones.find(c => c.id === calificacion_id);
        if (!calActual) throw new Error("La calificación solicitada no existe en el sistema.");

        // NUEVO: Validar seguridad para que un DOCENTE solo modifique a sus alumnos
        const docente = await this.usuarioRepository.buscarPorId(docente_id);
        if (!docente) throw new Error("El usuario que intenta modificar no existe.");

        if (docente.rol === 'DOCENTE') {
            const asignaciones = await this.asignacionDocenteRepository.listarTodas();
            const estaAsignado = asignaciones.some(a => 
                a.docente_id === docente_id && 
                a.asignatura_id === calActual.asignatura_id && 
                a.paralelo_id === calActual.paralelo_id
            );

            if (!estaAsignado) {
                throw new Error("Acceso denegado: Usted no está asignado como docente a este estudiante en esta asignatura.");
            }
        }

        const nota_anterior = calActual.nota;

        // 2. Ejecutar la actualización (esto automáticamente crea la huella imborrable en auditoría gracias al repositorio)
        await this.calificacionRepository.actualizar(calificacion_id, {
            nota_nueva: nota_nueva,
            usuario_id: docente_id,
            motivo: observacion
        });

        // 3. Enviar notificación al correo electrónico del estudiante
        const estudiante = await this.usuarioRepository.buscarPorId(calActual.estudiante_id);
        if (estudiante && estudiante.correo) {
            await this.emailService.enviarNotificacionModificacionCalificacion(
                estudiante.correo, 
                `${estudiante.nombres} ${estudiante.apellidos}`, 
                calActual.asignatura_nombre, 
                calActual.actividad_nombre || 'Promedio Final (Cierre)', 
                nota_anterior, 
                nota_nueva
            );
        }

        return { mensaje: "Registro modificado" };
    }
}

module.exports = ModificarCalificacionDocenteUseCase;