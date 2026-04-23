//definimos un arreglo de objetos que representa a los servidores con sus respectivas notas
const personal =[
    {nombre: "cbos juan perez", notas:[15,16,14]},
    {nombre: "cbos maria lopez", notas:[18,17,19]},
    {nombre: "cbos carlos garcia", notas:[12,14,13]},
];
const notaMinimaAprobar = 14;
//2. procesar datos: calcular promedios y estados
const resultados = personal.map(servidor =>{
//sumamos todas las notas  del arreglo de notas del servidor
let suma=0;
for (let i=0; i<servidor.notas.length; i++){
    suma+=servidor.notas[i];
}
//calculamos el promedio de notas del servidor
let promedio=suma/servidor.notas.length;
//determinamos el estado usando una condicion simple
let estado="";
if (promedio >= notaMinimaAprobar){
    estado="aprobado";
}else{
    estado="reprobado";
}
//retornamos un nuevo objeto con el nombre, promedio y estado del servidor
return {
    nombre: servidor.nombre,
    promedio: promedio,
    estado: estado
};
});
//3. ordenar la lista de resultados por promedio de mayor a menor
resultados.sort((a,b) => b.promedio - a.promedio);   
//4. mostrar resultados
console.log("======================================");
console.log("REPORTE DE CALIFICACIONE Y ANTIGUEDAD");
console.log("======================================");
resultados.forEach((servidor, indice)=>{
    let puesto = indice + 1; 
    let promedioformateado = servidor.promedio.toFixed(2);
    console.log('${puesto}. ${servidor.nombre} - Promedio: ${promedioformateado} - Estado: ${servidor.estado}');
    console.log('-promedio: ${promedioformateado} /20');
    console.log('-condicion: ${servidor.estado}');
    console.log('-----------------------------');

});


