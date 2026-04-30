class ActualizarAsignaturaUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(id, datos) {
        if (!datos.nombre) throw new Error("El nombre de la asignatura es obligatorio.");
        return await this.repositorio.actualizar(id, datos);
    }
}
module.exports = ActualizarAsignaturaUseCase;