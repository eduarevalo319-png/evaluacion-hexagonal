class GenerarReporteUseCase{
    constructor(repositorio){
        this.repositorio=repositorio;   
    }
    
    // Agregamos 'async' porque ahora vamos a depender de un proceso que toma tiempo
    async ejecutar(){
        // Agregamos 'await' para esperar los datos
        const servidores = await this.repositorio.obtenerPersonal();
        const resultados=servidores.map(servidor=>{
            return{
                nombre:servidor.nombre,
                promedio:servidor.calcularPromedio(),
                estado:servidor.obtenerEstado()
            };
        });
        resultados.sort((a,b)=>b.promedio-a.promedio);
        return resultados;
    }
}
module.exports=GenerarReporteUseCase;