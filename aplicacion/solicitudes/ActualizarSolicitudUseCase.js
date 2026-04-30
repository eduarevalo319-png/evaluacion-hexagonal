class ActualizarSolicitudUseCase {
    constructor(repositorio, emailService = null) { 
        this.repositorio = repositorio; 
        this.emailService = emailService;
    }
    async ejecutar(id, datos) {
        if (!datos.estado || !datos.respuesta) {
            throw new Error("Debe emitir una respuesta y seleccionar el estado final.");
        }
        
        const actualizada = await this.repositorio.actualizar(id, datos);
        
        // Si configuramos el servicio de correo, enviamos la notificación
        if (this.emailService) {
            const detalle = await this.repositorio.obtenerDetalleConCorreo(id);
            if (detalle && detalle.correo) await this.emailService.enviarNotificacionRecalificacion(detalle.correo, detalle);
        }
        
        return actualizada;
    }
}
module.exports = ActualizarSolicitudUseCase;