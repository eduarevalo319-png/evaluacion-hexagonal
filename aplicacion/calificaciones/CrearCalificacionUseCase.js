class CrearCalificacionUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(datos) {
        if (!datos.estudiante_id || !datos.asignatura_id || !datos.paralelo_id || datos.nota === undefined) {
            throw new Error("Todos los campos (estudiante, asignatura, paralelo y nota) son obligatorios.");
        }
        if (datos.nota < 0 || datos.nota > 20) throw new Error("La nota debe estar entre 0 y 20.");
        return await this.repositorio.crear(datos);
    }
}
module.exports = CrearCalificacionUseCase;