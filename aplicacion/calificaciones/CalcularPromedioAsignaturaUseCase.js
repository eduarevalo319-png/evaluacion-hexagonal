class CalcularPromedioAsignaturaUseCase {
    constructor(matriculaRepository, actividadRepository, calificacionRepository, usuarioRepository, asignaturaRepository, emailService) {
        this.matriculaRepository = matriculaRepository;
        this.actividadRepository = actividadRepository;
        this.calificacionRepository = calificacionRepository;
        this.usuarioRepository = usuarioRepository;
        this.asignaturaRepository = asignaturaRepository;
        this.emailService = emailService;
    }

    async ejecutar(datos) {
        const { asignatura_id, paralelo_id } = datos;

        if (!asignatura_id || !paralelo_id) {
            throw new Error("Faltan parámetros: Asignatura y paralelo son obligatorios.");
        }

        // 1. Obtener actividades para determinar si es Cualitativa o Cuantitativa
        const todasActividades = await this.actividadRepository.listarTodas();
        const actividadesAsignatura = todasActividades.filter(a => a.asignatura_id === asignatura_id);
        const esCualitativa = actividadesAsignatura.some(a => a.caracteristica === 'CUALITATIVA');

        // 2. Validar que no se haya calculado antes en este paralelo
        const todasCalificaciones = await this.calificacionRepository.listarTodas();
        const promediosExistentes = todasCalificaciones.filter(c => c.asignatura_id === asignatura_id && c.paralelo_id === paralelo_id && c.actividad_id === null);
        if (promediosExistentes.length > 0) {
            throw new Error("El promedio ya ha sido calculado y almacenado de manera definitiva para este paralelo.");
        }

        // 3. Obtener los estudiantes matriculados en este paralelo
        const matriculas = await this.matriculaRepository.listarTodas();
        const estudiantesParalelo = matriculas.filter(m => m.paralelo_id === paralelo_id);
        const asignatura = await this.asignaturaRepository.buscarPorId(asignatura_id);

        let calculados = 0;

        for (const mat of estudiantesParalelo) {
            const notasEstudiante = todasCalificaciones.filter(c => c.estudiante_id === mat.estudiante_id && c.asignatura_id === asignatura_id && c.actividad_id !== null);
            
            let suma = 0;
            let notaSupletorio = null;

            for (const act of actividadesAsignatura) {
                const notaObj = notasEstudiante.find(n => n.actividad_id === act.id);
                const valor = notaObj ? parseFloat(notaObj.nota) : 0;
                
                // Detectamos la actividad de supletorio por su nombre
                if (act.nombre.toUpperCase().includes('SUPLETORIO')) {
                    notaSupletorio = valor;
                } else {
                    suma += valor;
                }
            }

            let promedioFinal = suma;
            // Regla: Si hay nota de supletorio mayor a 0, reemplaza la suma. Si es >= 14, se topa en 14.
            if (notaSupletorio !== null && notaSupletorio > 0) {
                promedioFinal = notaSupletorio >= 14 ? 14 : notaSupletorio;
            }

            // Evaluar observaciones
            let observacion = "";
            if (esCualitativa) {
                observacion = promedioFinal >= 14 ? "APTO" : "NO APTO";
            } else {
                if (promedioFinal >= 14) observacion = "APROBADO";
                else if (promedioFinal >= 8) observacion = "SUPLETORIO";
                else observacion = "REPROBADO";
            }

            // Guardar en la DB de forma definitiva (actividad_id = null representa un promedio final)
            await this.calificacionRepository.guardarPromedio({ estudiante_id: mat.estudiante_id, asignatura_id, paralelo_id, nota: promedioFinal, observacion });
            // Enviar notificación
            const estudiante = await this.usuarioRepository.buscarPorId(mat.estudiante_id);
            if (estudiante && estudiante.correo) await this.emailService.enviarNotificacionPromedioAsignatura(estudiante.correo, `${estudiante.nombres} ${estudiante.apellidos}`, asignatura.nombre, promedioFinal.toFixed(2), observacion);
            calculados++;
        }
        return { mensaje: `Cálculo completado. Se registraron ${calculados} promedios y se notificó a los alumnos.` };
    }
}
module.exports = CalcularPromedioAsignaturaUseCase;