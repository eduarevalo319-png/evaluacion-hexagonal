class Servidor{
    constructor(nombre,notas){
        this.nombre=nombre;
        this.notas=notas;
    }
    //REGLA DE NEGOCIO :¿COMO SE CALCULA EL PROMEDIO?
    calcularPromedio(){
        let suma=0;
        for(let i=0;i<this.notas.length;i++){
            suma+=this.notas[i];    
        }
        return suma/this.notas.length;
    }
    //REGLA DE NEGOCIO :¿CUANDO ES APTO PARA ASCENSO?
    obtenerEstado(){
        const promedio=this.calcularPromedio();
        if(promedio>=14){
            return "APTO PARA ASCENSO"
        }else{
            return "NO ES APTO PARA ASCENSO"
        }
    }
}
//EXPORTAMOS LA CLASE PARA QUE OTRAS CAPAS PUEDAN USARLA
module.exports=Servidor;    