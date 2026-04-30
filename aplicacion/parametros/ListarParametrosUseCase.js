class ListarParametrosUseCase {
    constructor(parametroRepository) { this.parametroRepository = parametroRepository; }
    async ejecutar() {
        return await this.parametroRepository.listarTodos();
    }
}
module.exports = ListarParametrosUseCase;