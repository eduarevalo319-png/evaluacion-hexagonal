class CrearPromocionUseCase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async ejecutar(datos) {
        if (!datos.nombre || !datos.anio) {
            throw new Error("El nombre y el año son obligatorios para crear una promoción");
        }
        return await this.repositorio.crear(datos);
    }
}

module.exports = CrearPromocionUseCase;