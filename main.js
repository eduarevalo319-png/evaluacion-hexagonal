const RepositorioLocal=require('./infraestructura/RepositorioLocal');
const GenerarReporteUseCase=require('./aplicacion/GenerarReporteUseCase');
const repositorio=new RepositorioLocal();
const generarReporte=new GenerarReporteUseCase(repositorio);
const reporteFinal=generarReporte.ejecutar();
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

