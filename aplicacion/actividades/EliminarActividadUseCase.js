class EliminarActividadUseCase {
    constructor(actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    async ejecutar(id) {
        if (!id) {
            throw new Error("El ID de la actividad es obligatorio para eliminarla.");
        }
        return await this.actividadRepository.eliminar(id);
    }
}

module.exports = EliminarActividadUseCase;