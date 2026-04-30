const pool = require('./conexion');

class UsuarioRepository {
    async listarTodos() {
        const [filas] = await pool.query("SELECT * FROM usuarios WHERE estado = 'ACTIVO'");
        return filas;
    }
    
    async buscarPorCedula(cedula) {
        const [filas] = await pool.query("SELECT id, cedula, nombres, apellidos, correo, rol, estado, password FROM usuarios WHERE cedula = ? AND estado = 'ACTIVO'", [cedula]);
        return filas.length > 0 ? filas[0] : null;
    }

    async buscarPorId(id) {
        const [filas] = await pool.query("SELECT id, cedula, nombres, apellidos, correo, rol FROM usuarios WHERE id = ? AND estado = 'ACTIVO'", [id]);
        return filas.length > 0 ? filas[0] : null;
    }

    async crear(datos) {
        const { cedula, nombres, apellidos, correo, rol, password } = datos;
        // Usamos null si el correo viene vacío para no tener problemas de duplicidad (UNIQUE)
        const correoFinal = correo && correo.trim() !== '' ? correo.trim() : null; 
        try {
            const [resultado] = await pool.query(
                "INSERT INTO usuarios (cedula, nombres, apellidos, correo, rol, password) VALUES (?, ?, ?, ?, ?, ?)",
                [cedula, nombres, apellidos, correoFinal, rol, password]
            );
            return { id: resultado.insertId, ...datos, estado: 'ACTIVO' };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new Error("La cédula o el correo ya están registrados en otro usuario.");
            throw error;
        }
    }
    
    async actualizar(id, datos) {
        const { cedula, nombres, apellidos, correo, rol } = datos;
        const correoFinal = correo && correo.trim() !== '' ? correo.trim() : null;
        try {
            await pool.query(
                "UPDATE usuarios SET cedula = ?, nombres = ?, apellidos = ?, correo = ?, rol = ? WHERE id = ?",
                [cedula, nombres, apellidos, correoFinal, rol, id]
            );
            return { id, ...datos };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') throw new Error("La cédula o el correo ya están registrados en otro usuario.");
            throw error;
        }
    }
    
    async eliminar(id) {
        await pool.query("UPDATE usuarios SET estado = 'INACTIVO' WHERE id = ?", [id]);
        return true;
    }
}

module.exports = UsuarioRepository;