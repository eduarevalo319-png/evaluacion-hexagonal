const Servidor = require('../dominio/Servidor');

class RepositorioLocal {
    obtenerPersonal() {
        return [
            new Servidor("Cbos. Juan Perez", [15, 16, 14]),
            new Servidor("Cbos. Luis Silva", [12, 10, 11]),
            new Servidor("Cbos. Ana Gomez", [19, 18, 20]),
            new Servidor("Cbos. Carlos Ruiz", [14, 14, 15])
        ];
    }
}

module.exports = RepositorioLocal;