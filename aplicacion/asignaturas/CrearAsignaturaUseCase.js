class CrearAsignaturaUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(datos) {
        if (!datos.nombre) throw new Error("El nombre de la asignatura es obligatorio.");
        return await this.repositorio.crear(datos);
    }
}
module.exports = CrearAsignaturaUseCase;