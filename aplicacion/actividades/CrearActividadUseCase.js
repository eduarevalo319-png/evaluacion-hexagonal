class CrearActividadUseCase {
    constructor(actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    async ejecutar(datos) {
        // Validación básica de reglas de negocio
        if (!datos.asignatura_id || !datos.nombre || !datos.caracteristica) {
            throw new Error("La asignatura, el nombre y la característica son obligatorios.");
        }
        
        return await this.actividadRepository.crear(datos);
    }
}

module.exports = CrearActividadUseCase;