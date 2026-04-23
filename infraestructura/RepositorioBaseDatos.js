const mysql = require('mysql2/promise');
const Servidor = require('../dominio/Servidor');

class RepositorioBaseDatos {
    async obtenerPersonal() {
        // 1. Configurar la conexión (Reemplaza con tus datos reales)
        const conexion = await mysql.createConnection({
            host: 'localhost',
            user: 'root', // tu usuario de MySQL
            password: '', // tu contraseña de MySQL
            database: 'evaluacion_db' // el nombre de tu base de datos
        });

        // 2. Ejecutar la consulta SQL (Esperamos a que responda con 'await')
        const [filas] = await conexion.execute('SELECT nombre, nota1, nota2, nota3 FROM servidores');
        
        // 3. Transformar los datos crudos de MySQL en nuestra clase de Dominio
        const servidores = filas.map(fila => {
            return new Servidor(fila.nombre, [fila.nota1, fila.nota2, fila.nota3]);
        });

        return servidores;
    }
}

module.exports = RepositorioBaseDatos;