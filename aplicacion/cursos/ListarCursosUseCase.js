class ListarCursosUseCase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async ejecutar() {
        return await this.repositorio.listarTodos();
    }
}

module.exports = ListarCursosUseCase;