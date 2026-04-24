const express = require('express');
const cors = require('cors');
const RepositorioBaseDatos = require('./infraestructura/RepositorioBaseDatos');
const GenerarReporteUseCase=require('./aplicacion/GenerarReporteUseCase');
const CrearServidorUseCase = require('./aplicacion/CrearServidorUseCase');
const ActualizarServidorUseCase = require('./aplicacion/ActualizarServidorUseCase');
const EliminarServidorUseCase = require('./aplicacion/EliminarServidorUseCase');

const repositorio = new RepositorioBaseDatos();
const generarReporte=new GenerarReporteUseCase(repositorio);
const crearServidor = new CrearServidorUseCase(repositorio);
const actualizarServidor = new ActualizarServidorUseCase(repositorio);
const eliminarServidor = new EliminarServidorUseCase(repositorio);

const app = express();  
app.use(cors()); // Permite que Angular se conecte sin problemas de seguridad (CORS)
app.use(express.json());

// ================= RUTAS DE LA API (CRUD) =================

// READ (GET)
app.get('/api/reporte', async (req, res) => {
    try {
        const reporteFinal = await generarReporte.ejecutar();
        // En lugar de imprimir en consola, enviamos los datos como JSON
        res.json(reporteFinal);
    } catch (error) {
        console.error("Error técnico:", error.message);
        res.status(500).json({ error: "Hubo un problema al generar el reporte" });
    }
});

// CREATE (POST)
app.post('/api/servidores', async (req, res) => {
    try {
        // Espera un JSON así: { "nombre": "nuevo nombre", "notas": [15, 20, 14] }
        const nuevo = await crearServidor.ejecutar(req.body);
        res.status(201).json({ mensaje: "Servidor creado con éxito", servidor: nuevo });
    } catch (error) {
        console.error("Error al crear:", error.message);
        res.status(500).json({ error: "Error al crear el servidor" });
    }
});

// UPDATE (PUT)
app.put('/api/servidores/:nombre', async (req, res) => {
    try {
        const nombreOriginal = req.params.nombre;
        const actualizado = await actualizarServidor.ejecutar(nombreOriginal, req.body);
        res.json({ mensaje: "Servidor actualizado con éxito", servidor: actualizado });
    } catch (error) {
        console.error("Error al actualizar:", error.message);
        res.status(500).json({ error: "Error al actualizar el servidor" });
    }
});

// DELETE (DELETE)
app.delete('/api/servidores/:nombre', async (req, res) => {
    try {
        await eliminarServidor.ejecutar(req.params.nombre);
        res.json({ mensaje: "Servidor eliminado con éxito" });
    } catch (error) {
        console.error("Error al eliminar:", error.message);
        res.status(500).json({ error: "Error al eliminar el servidor" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
});
