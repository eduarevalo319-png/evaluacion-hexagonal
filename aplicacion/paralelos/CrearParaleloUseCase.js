class CrearParaleloUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(datos) {
        if (!datos.curso_id || !datos.nombre) throw new Error("El paralelo debe pertenecer a un curso y tener nombre.");
        return await this.repositorio.crear(datos);
    }
}
module.exports = CrearParaleloUseCase;