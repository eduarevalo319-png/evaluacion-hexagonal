const Servidor = require('../dominio/Servidor');

class ActualizarServidorUseCase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async ejecutar(nombreOriginal, datos) {
        const servidorActualizado = new Servidor(datos.nombre, datos.notas);
        await this.repositorio.actualizar(nombreOriginal, servidorActualizado);
        return servidorActualizado;
    }
}
module.exports = ActualizarServidorUseCase;