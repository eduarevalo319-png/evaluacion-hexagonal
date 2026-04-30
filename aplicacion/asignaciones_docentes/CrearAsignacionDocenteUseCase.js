class CrearAsignacionDocenteUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(datos) {
        if (!datos.paralelo_id || !datos.asignatura_id || !datos.docente_id) {
            throw new Error("El paralelo, la asignatura y el docente son obligatorios.");
        }
        return await this.repositorio.crear(datos);
    }
}
module.exports = CrearAsignacionDocenteUseCase;