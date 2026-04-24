class GenerarReporteUseCase{
    constructor(repositorio){
        this.repositorio=repositorio;   
    }
    
    // Agregamos 'async' porque ahora vamos a depender de un proceso que toma tiempo
    async ejecutar(){
        // Agregamos 'await' para esperar los datos
        const servidores = await this.repositorio.obtenerPersonal();
        const resultados=servidores.map(servidor=>{
            // REGLAS ADAPTADAS EN LA CAPA DE APLICACIÓN
            const suma = servidor.notas.reduce((acumulador, nota) => acumulador + Number(nota), 0);
            const promedioCalculado = suma / servidor.notas.length;
            const estadoEvaluado = promedioCalculado >= 14 ? "APTO PARA ASCENSO" : "NO ES APTO PARA ASCENSO";

            return{
                nombre:servidor.nombre,
                promedio: promedioCalculado,
                estado: estadoEvaluado
            };
        });
        resultados.sort((a,b)=>b.promedio-a.promedio);
        return resultados;
    }
}
module.exports=GenerarReporteUseCase;