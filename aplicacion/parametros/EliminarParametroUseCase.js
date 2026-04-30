class EliminarParametroUseCase {
    constructor(parametroRepository) { this.parametroRepository = parametroRepository; }
    async ejecutar(id) {
        if (!id) throw new Error("El ID es obligatorio.");
        return await this.parametroRepository.eliminar(id);
    }
}
module.exports = EliminarParametroUseCase;