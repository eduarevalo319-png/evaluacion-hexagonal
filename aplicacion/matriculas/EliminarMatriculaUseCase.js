class EliminarMatriculaUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(id) {
        return await this.repositorio.eliminar(id);
    }
}
module.exports = EliminarMatriculaUseCase;