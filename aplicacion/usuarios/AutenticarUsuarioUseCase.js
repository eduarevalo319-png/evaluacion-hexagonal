const bcrypt = require('bcryptjs');

class AutenticarUsuarioUseCase {
    constructor(repositorio) { this.repositorio = repositorio; }
    async ejecutar(cedula, password) {
        if (!cedula || !password) throw new Error("Cédula y contraseña son obligatorias.");
        const usuario = await this.repositorio.buscarPorCedula(cedula);
        if (!usuario) throw new Error("No existe un usuario activo con esta cédula.");

        // Verificamos la contraseña encriptada
        const esValida = await bcrypt.compare(password, usuario.password || '');
        
        if (!esValida) {
            // HACK DE COMPATIBILIDAD: Para los usuarios viejos creados antes de esta actualización
            if (usuario.password !== null) throw new Error("Credenciales incorrectas.");
        }

        // Por seguridad extrema, borramos la contraseña encriptada de la memoria antes de mandarla a Angular
        delete usuario.password; 
        return usuario;
    }
}
module.exports = AutenticarUsuarioUseCase;