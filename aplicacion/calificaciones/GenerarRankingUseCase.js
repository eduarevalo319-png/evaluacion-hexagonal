class GenerarRankingUseCase {
    constructor(repositorio) {
        this.repositorio = repositorio;
    }

    async ejecutar() {
        const calificaciones = await this.repositorio.obtenerTodasLasNotas();
        const mapa = {};

        // 1. Agrupar notas por estudiante y curso
        calificaciones.forEach(c => {
            const key = `${c.estudiante_id}-${c.curso_nombre}`;
            if (!mapa[key]) {
                mapa[key] = {
                    cedula: c.cedula,
                    apellidos_nombres: `${c.apellidos} ${c.nombres}`,
                    curso_nombre: c.curso_nombre,
                    suma: 0,
                    cantidad: 0
                };
            }
            mapa[key].suma += parseFloat(c.nota);
            mapa[key].cantidad += 1;
        });

        // 2. Calcular Promedios y Estado
        const resultados = Object.values(mapa).map(est => {
            const promedio = est.suma / est.cantidad;
            return { ...est, promedio, estado: promedio >= 14 ? 'APTO PARA ASCENSO' : 'REPROBADO' };
        });

        // 3. Ordenar por promedio (de mayor a menor) y asignar Antigüedad
        resultados.sort((a, b) => b.promedio - a.promedio);
        resultados.forEach((est, index) => est.antiguedad = index + 1);

        return resultados;
    }
}
module.exports = GenerarRankingUseCase;