const RepositorioBaseDatos = require('./infraestructura/RepositorioBaseDatos');
const GenerarReporteUseCase=require('./aplicacion/GenerarReporteUseCase');

const repositorio = new RepositorioBaseDatos();
const generarReporte=new GenerarReporteUseCase(repositorio);

async function iniciarAplicacion() {
    try {
        const reporteFinal = await generarReporte.ejecutar();
        console.log("===================================");
        console.log("REPORTE DE ANTIGUEDAD");
        console.log("===================================");
        reporteFinal.forEach((servidor,indice)=>{
            let puesto=indice+1;
            console.log(`${puesto}ra Antiguedad|${servidor.nombre}`);
            console.log(`Promedio:${servidor.promedio.toFixed(2)}`);
            console.log(`-Condicion:${servidor.estado}`);
            console.log('-----------------------------------');
        });
    } catch (error) {
        console.log("❌ UPS! Hubo un problema al iniciar la aplicación.");
        console.log("Por favor, verifica que tu base de datos MySQL esté encendida.");
        console.log("Detalle técnico:", error.message);
    }
}

iniciarAplicacion();
