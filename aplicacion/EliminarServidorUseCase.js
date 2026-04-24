class EliminarServidorUseCase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async ejecutar(nombre) {
        // Para eliminar, solo necesitamos decirle al repositorio a quién borrar
        await this.repositorio.eliminar(nombre);
    }
}
module.exports = EliminarServidorUseCase;