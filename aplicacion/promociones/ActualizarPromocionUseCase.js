class ActualizarPromocionUseCase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async ejecutar(id, datos) {
        if (!datos.nombre || !datos.anio) {
            throw new Error("El nombre y el año son obligatorios para actualizar");
        }
        return await this.repositorio.actualizar(id, datos);
    }
}

module.exports = ActualizarPromocionUseCase;