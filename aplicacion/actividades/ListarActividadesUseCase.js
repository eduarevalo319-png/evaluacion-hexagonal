class ListarActividadesUseCase {
    constructor(actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    async ejecutar() {
        return await this.actividadRepository.listarTodas();
    }
}

module.exports = ListarActividadesUseCase;