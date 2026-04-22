class GenerarReporteUseCase{
    constructor(repositorio){
        this.repositorio=repositorio;   
    }
    
    ejecutar(){
        const servidores=this.repositorio.obtenerPersonal();
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