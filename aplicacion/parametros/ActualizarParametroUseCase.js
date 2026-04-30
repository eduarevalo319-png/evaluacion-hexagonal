class ActualizarParametroUseCase {
    constructor(parametroRepository) { this.parametroRepository = parametroRepository; }
    async ejecutar(id, datos) {
        if (!id || !datos.tipo || !datos.nombre) throw new Error("ID, tipo y nombre obligatorios.");
        return await this.parametroRepository.actualizar(id, datos);
    }
}
module.exports = ActualizarParametroUseCase;