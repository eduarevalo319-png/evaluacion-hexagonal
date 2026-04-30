class CrearSolicitudUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(datos) {
        if (!datos.calificacion_id || !datos.motivo) {
            throw new Error("Debe seleccionar la calificación y explicar el motivo de la solicitud.");
        }
        return await this.repositorio.crear(datos);
    }
}
module.exports = CrearSolicitudUseCase;