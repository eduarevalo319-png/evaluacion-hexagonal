const mysql = require('mysql2/promise');
const Servidor = require('../dominio/Servidor');

class RepositorioBaseDatos {
    // Centralizamos la conexión para no repetir código
    async _conectar() {
        return await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'evaluacion_db' });
    }

    // READ (Leer todos)
    async obtenerPersonal() {
        const conexion = await this._conectar();
        const [filas] = await conexion.execute('SELECT nombre, nota1, nota2, nota3 FROM servidores');
        
        await conexion.end();

        // 4. Transformar los datos crudos de MySQL en nuestra clase de Dominio
        const servidores = filas.map(fila => {
            return new Servidor(fila.nombre, [fila.nota1, fila.nota2, fila.nota3]);
        });

        return servidores;
    }

    // CREATE (Crear)
    async crear(servidor) {
        const conexion = await this._conectar();
        await conexion.execute(
            'INSERT INTO servidores (nombre, nota1, nota2, nota3) VALUES (?, ?, ?, ?)',
            [servidor.nombre, servidor.notas[0], servidor.notas[1], servidor.notas[2]]
        );
        await conexion.end();
    }

    // UPDATE (Actualizar)
    async actualizar(nombreOriginal, servidor) {
        const conexion = await this._conectar();
        await conexion.execute(
            'UPDATE servidores SET nombre = ?, nota1 = ?, nota2 = ?, nota3 = ? WHERE nombre = ?',
            [servidor.nombre, servidor.notas[0], servidor.notas[1], servidor.notas[2], nombreOriginal]
        );
        await conexion.end();
    }

    // DELETE (Eliminar)
    async eliminar(nombre) {
        const conexion = await this._conectar();
        await conexion.execute('DELETE FROM servidores WHERE nombre = ?', [nombre]);
        await conexion.end();
    }
}

module.exports = RepositorioBaseDatos;