class CrearCursoAsignaturaUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(datos) {
        if (!datos.curso_id || !datos.asignatura_id) {
            throw new Error("El curso y la asignatura son obligatorios.");
        }
        return await this.repositorio.crear(datos);
    }
}
module.exports = CrearCursoAsignaturaUseCase;