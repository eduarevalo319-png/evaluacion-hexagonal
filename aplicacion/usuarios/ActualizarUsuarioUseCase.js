class ActualizarUsuarioUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(id, datos) {
        if (!datos.cedula || !datos.nombres || !datos.apellidos || !datos.rol) {
            throw new Error("Cédula, nombres, apellidos y rol son obligatorios.");
        }
        return await this.repositorio.actualizar(id, datos);
    }
}
module.exports = ActualizarUsuarioUseCase;