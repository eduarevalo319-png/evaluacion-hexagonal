class ActualizarActividadUseCase {
    constructor(actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    async ejecutar(id, datos) {
        if (!id) {
            throw new Error("El ID de la actividad es obligatorio para actualizar.");
        }
        if (!datos.asignatura_id || !datos.nombre || !datos.caracteristica) {
            throw new Error("La asignatura, el nombre y la característica son obligatorios.");
        }
        
        return await this.actividadRepository.actualizar(id, datos);
    }
}

module.exports = ActualizarActividadUseCase;