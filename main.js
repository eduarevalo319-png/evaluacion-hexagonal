const express = require('express');
const cors = require('cors');
const RepositorioBaseDatos = require('./infraestructura/RepositorioBaseDatos');
const GenerarReporteUseCase=require('./aplicacion/GenerarReporteUseCase');

const repositorio = new RepositorioBaseDatos();
const generarReporte=new GenerarReporteUseCase(repositorio);

const app = express();
app.use(cors()); // Permite que Angular se conecte sin problemas de seguridad (CORS)
app.use(express.json());

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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
});
