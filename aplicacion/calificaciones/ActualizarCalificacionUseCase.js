class ActualizarCalificacionUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(id, datos) {
        if (datos.nota_nueva < 0 || datos.nota_nueva > 20) throw new Error("La nota debe estar entre 0 y 20.");
        if (!datos.usuario_id || !datos.motivo) {
            throw new Error("Por razones de auditoría, debe proveer un motivo válido para la modificación.");
        }
        return await this.repositorio.actualizar(id, datos);
    }
}
module.exports = ActualizarCalificacionUseCase;