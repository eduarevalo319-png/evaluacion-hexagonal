class CrearCursoUseCase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async ejecutar(datos) {
        if (!datos.promocion_id || !datos.nombre || !datos.estado_academico) {
            throw new Error("El curso debe pertenecer a una promoción, tener un nombre y un estado académico.");
        }
        return await this.repositorio.crear(datos);
    }
}

module.exports = CrearCursoUseCase;