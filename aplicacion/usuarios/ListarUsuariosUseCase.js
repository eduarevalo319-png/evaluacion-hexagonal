class ListarUsuariosUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar() {
        return await this.repositorio.listarTodos();
    }
}
module.exports = ListarUsuariosUseCase;