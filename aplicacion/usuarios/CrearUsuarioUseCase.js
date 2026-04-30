const bcrypt = require('bcryptjs');

class CrearUsuarioUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(datos) {
        if (!datos.cedula || !datos.nombres || !datos.apellidos || !datos.rol) {
            throw new Error("Cédula, nombres, apellidos y rol son obligatorios.");
        }
        
        // Encriptar la contraseña (por defecto será la misma cédula del usuario)
        const salt = await bcrypt.genSalt(10);
        datos.password = await bcrypt.hash(datos.cedula, salt);

        return await this.repositorio.crear(datos);
    }
}
module.exports = CrearUsuarioUseCase;