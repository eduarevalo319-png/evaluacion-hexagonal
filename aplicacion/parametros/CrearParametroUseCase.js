class CrearParametroUseCase {
    constructor(parametroRepository) { this.parametroRepository = parametroRepository; }
    async ejecutar(datos) {
        if (!datos.tipo || !datos.nombre) throw new Error("El tipo y el nombre son obligatorios.");
        return await this.parametroRepository.crear(datos);
    }
}
module.exports = CrearParametroUseCase;