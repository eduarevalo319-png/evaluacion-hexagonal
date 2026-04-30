const SincronizarActividadDocenteUseCase = require('../../aplicacion/calificaciones/SincronizarActividadDocenteUseCase');
const CalificacionRepository = require('../../infraestructura/CalificacionRepository');
const ActividadRepository = require('../../infraestructura/ActividadRepository');
const UsuarioRepository = require('../../infraestructura/UsuarioRepository');
const MoodleService = require('../../infraestructura/MoodleService');

// Instanciamos las dependencias una sola vez para reutilizarlas
const calificacionRepository = new CalificacionRepository();
const actividadRepository = new ActividadRepository();
const usuarioRepository = new UsuarioRepository();
const moodleService = new MoodleService();

const sincronizarActividadDocenteUseCase = new SincronizarActividadDocenteUseCase(
    calificacionRepository,
    actividadRepository,
    usuarioRepository,
    moodleService
);

// Controlador para la sincronización de actividades
const sincronizarActividad = async (req, res) => {
    try {
        const { actividad_id, paralelo_id, asignatura_id } = req.body;

        if (!actividad_id || !paralelo_id || !asignatura_id) {
            return res.status(400).json({ error: 'Faltan parámetros: actividad_id, paralelo_id y asignatura_id son requeridos.' });
        }

        const resultado = await sincronizarActividadDocenteUseCase.ejecutar({
            actividad_id,
            paralelo_id,
            asignatura_id
        });

        res.status(200).json(resultado);
    } catch (error) {
        console.error("❌ Error en el controlador de sincronización:", error);
        res.status(500).json({ error: error.message || 'Error interno del servidor.' });
    }
};

module.exports = {
    sincronizarActividad
};

