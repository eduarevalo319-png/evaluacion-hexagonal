class ListarCalificacionesUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar() {
        return await this.repositorio.listarTodas();
    }
}
module.exports = ListarCalificacionesUseCase;