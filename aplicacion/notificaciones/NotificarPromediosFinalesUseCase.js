class NotificarPromediosFinalesUseCase {
    constructor(usuarioRepository, emailService) {
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    async ejecutar(datos) {
        const { promocion_nombre, resultados } = datos;
        let enviados = 0;

        for (const res of resultados) {
            const estudiante = await this.usuarioRepository.buscarPorId(res.estudiante_id);
            if (estudiante && estudiante.correo) {
                await this.emailService.enviarNotificacionPromedioFinal(
                    estudiante.correo,
                    `${estudiante.nombres} ${estudiante.apellidos}`,
                    promocion_nombre,
                    res.promedio.toFixed(3), // Conforme a la normativa de 3 decimales
                    res.estado
                );
                enviados++;
            }
        }
        return { mensaje: `Proceso finalizado. Se enviaron ${enviados} notificaciones de promedio final a los estudiantes.` };
    }
}

module.exports = NotificarPromediosFinalesUseCase;