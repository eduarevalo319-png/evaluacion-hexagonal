const Servidor = require('../dominio/Servidor');

class CrearServidorUseCase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async ejecutar(datos) {
        // 1. Usamos el dominio para instanciar un nuevo servidor puro
        const nuevoServidor = new Servidor(datos.nombre, datos.notas);
        
        // 2. Le ordenamos a la infraestructura guardarlo
        await this.repositorio.crear(nuevoServidor);
        return nuevoServidor;
    }
}
module.exports = CrearServidorUseCase;