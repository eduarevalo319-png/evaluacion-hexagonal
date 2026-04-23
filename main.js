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
            const sufijos = { 1: 'ra', 2: 'da', 3: 'ra', 7: 'ma', 8: 'va', 9: 'na', 10: 'ma' };
            const sufijo = sufijos[puesto] || 'ta';
            console.log(`${puesto}${sufijo} Antiguedad|${servidor.nombre}`);
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
