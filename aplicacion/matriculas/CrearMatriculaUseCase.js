class CrearMatriculaUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(datos) {
        if (!datos.paralelo_id || !datos.estudiante_id) {
            throw new Error("El paralelo y el estudiante son obligatorios.");
        }
        return await this.repositorio.crear(datos);
    }
}
module.exports = CrearMatriculaUseCase;