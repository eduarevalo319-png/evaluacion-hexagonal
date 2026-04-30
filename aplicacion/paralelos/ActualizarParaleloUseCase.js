class ActualizarParaleloUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(id, datos) {
        if (!datos.curso_id || !datos.nombre) throw new Error("El paralelo debe pertenecer a un curso y tener nombre.");
        return await this.repositorio.actualizar(id, datos);
    }
}
module.exports = ActualizarParaleloUseCase;