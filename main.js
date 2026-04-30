const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const { exec } = require('child_process');

// === NUEVOS IMPORTS PARA LA ACADEMIA (TRAMO 1) ===
const PromocionRepository = require('./infraestructura/PromocionRepository');
const ListarPromocionesUseCase = require('./aplicacion/promociones/ListarPromocionesUseCase');
const CrearPromocionUseCase = require('./aplicacion/promociones/CrearPromocionUseCase');
const ActualizarPromocionUseCase = require('./aplicacion/promociones/ActualizarPromocionUseCase');
const EliminarPromocionUseCase = require('./aplicacion/promociones/EliminarPromocionUseCase');
const repoPromociones = new PromocionRepository();
const listarPromociones = new ListarPromocionesUseCase(repoPromociones);
const crearPromocion = new CrearPromocionUseCase(repoPromociones);
const actualizarPromocion = new ActualizarPromocionUseCase(repoPromociones);
const eliminarPromocion = new EliminarPromocionUseCase(repoPromociones);

// === IMPORTS PARA CURSOS ===
const CursoRepository = require('./infraestructura/CursoRepository');
const ListarCursosUseCase = require('./aplicacion/cursos/ListarCursosUseCase');
const CrearCursoUseCase = require('./aplicacion/cursos/CrearCursoUseCase');
const ActualizarCursoUseCase = require('./aplicacion/cursos/ActualizarCursoUseCase');
const EliminarCursoUseCase = require('./aplicacion/cursos/EliminarCursoUseCase');
const repoCursos = new CursoRepository();
const listarCursos = new ListarCursosUseCase(repoCursos);
const crearCurso = new CrearCursoUseCase(repoCursos);
const actualizarCurso = new ActualizarCursoUseCase(repoCursos);
const eliminarCurso = new EliminarCursoUseCase(repoCursos);

// === IMPORTS PARA ASIGNATURAS ===
const AsignaturaRepository = require('./infraestructura/AsignaturaRepository');
const ListarAsignaturasUseCase = require('./aplicacion/asignaturas/ListarAsignaturasUseCase');
const CrearAsignaturaUseCase = require('./aplicacion/asignaturas/CrearAsignaturaUseCase');
const ActualizarAsignaturaUseCase = require('./aplicacion/asignaturas/ActualizarAsignaturaUseCase');
const EliminarAsignaturaUseCase = require('./aplicacion/asignaturas/EliminarAsignaturaUseCase');
const repoAsignaturas = new AsignaturaRepository();
const listarAsignaturas = new ListarAsignaturasUseCase(repoAsignaturas);
const crearAsignatura = new CrearAsignaturaUseCase(repoAsignaturas);
const actualizarAsignatura = new ActualizarAsignaturaUseCase(repoAsignaturas);
const eliminarAsignatura = new EliminarAsignaturaUseCase(repoAsignaturas);

// === IMPORTS PARA PARALELOS ===
const ParaleloRepository = require('./infraestructura/ParaleloRepository');
const ListarParalelosUseCase = require('./aplicacion/paralelos/ListarParalelosUseCase');
const CrearParaleloUseCase = require('./aplicacion/paralelos/CrearParaleloUseCase');
const ActualizarParaleloUseCase = require('./aplicacion/paralelos/ActualizarParaleloUseCase');
const EliminarParaleloUseCase = require('./aplicacion/paralelos/EliminarParaleloUseCase');
const repoParalelos = new ParaleloRepository();
const listarParalelos = new ListarParalelosUseCase(repoParalelos);
const crearParalelo = new CrearParaleloUseCase(repoParalelos);
const actualizarParalelo = new ActualizarParaleloUseCase(repoParalelos);
const eliminarParalelo = new EliminarParaleloUseCase(repoParalelos);

// === IMPORTS PARA USUARIOS ===
const UsuarioRepository = require('./infraestructura/UsuarioRepository');
const ListarUsuariosUseCase = require('./aplicacion/usuarios/ListarUsuariosUseCase');
const CrearUsuarioUseCase = require('./aplicacion/usuarios/CrearUsuarioUseCase');
const ActualizarUsuarioUseCase = require('./aplicacion/usuarios/ActualizarUsuarioUseCase');
const EliminarUsuarioUseCase = require('./aplicacion/usuarios/EliminarUsuarioUseCase');
const AutenticarUsuarioUseCase = require('./aplicacion/usuarios/AutenticarUsuarioUseCase');
const repoUsuarios = new UsuarioRepository();
const listarUsuarios = new ListarUsuariosUseCase(repoUsuarios);
const crearUsuario = new CrearUsuarioUseCase(repoUsuarios);
const actualizarUsuario = new ActualizarUsuarioUseCase(repoUsuarios);
const eliminarUsuario = new EliminarUsuarioUseCase(repoUsuarios);
const autenticarUsuario = new AutenticarUsuarioUseCase(repoUsuarios);

// === IMPORTS PARA MATRICULAS ===
const MatriculaRepository = require('./infraestructura/MatriculaRepository');
const ListarMatriculasUseCase = require('./aplicacion/matriculas/ListarMatriculasUseCase');
const CrearMatriculaUseCase = require('./aplicacion/matriculas/CrearMatriculaUseCase');
const EliminarMatriculaUseCase = require('./aplicacion/matriculas/EliminarMatriculaUseCase');
const repoMatriculas = new MatriculaRepository();
const listarMatriculas = new ListarMatriculasUseCase(repoMatriculas);
const crearMatricula = new CrearMatriculaUseCase(repoMatriculas);
const eliminarMatricula = new EliminarMatriculaUseCase(repoMatriculas);

// === IMPORTS PARA ASIGNACIÓN DOCENTES ===
const AsignacionDocenteRepository = require('./infraestructura/AsignacionDocenteRepository');
const ListarAsignacionesDocentesUseCase = require('./aplicacion/asignaciones_docentes/ListarAsignacionesDocentesUseCase');
const CrearAsignacionDocenteUseCase = require('./aplicacion/asignaciones_docentes/CrearAsignacionDocenteUseCase');
const EliminarAsignacionDocenteUseCase = require('./aplicacion/asignaciones_docentes/EliminarAsignacionDocenteUseCase');
const repoAsignaciones = new AsignacionDocenteRepository();
const listarAsignaciones = new ListarAsignacionesDocentesUseCase(repoAsignaciones);
const crearAsignacion = new CrearAsignacionDocenteUseCase(repoAsignaciones);
const eliminarAsignacion = new EliminarAsignacionDocenteUseCase(repoAsignaciones);

// === IMPORTS PARA CALIFICACIONES ===
const CalificacionRepository = require('./infraestructura/CalificacionRepository');
const ListarCalificacionesUseCase = require('./aplicacion/calificaciones/ListarCalificacionesUseCase');
const CrearCalificacionUseCase = require('./aplicacion/calificaciones/CrearCalificacionUseCase');
const EliminarCalificacionUseCase = require('./aplicacion/calificaciones/EliminarCalificacionUseCase');
const ActualizarCalificacionUseCase = require('./aplicacion/calificaciones/ActualizarCalificacionUseCase');
const repoCalificaciones = new CalificacionRepository();
const listarCalificaciones = new ListarCalificacionesUseCase(repoCalificaciones);
const crearCalificacion = new CrearCalificacionUseCase(repoCalificaciones);
const eliminarCalificacion = new EliminarCalificacionUseCase(repoCalificaciones);
const actualizarCalificacion = new ActualizarCalificacionUseCase(repoCalificaciones);
const GenerarRankingUseCase = require('./aplicacion/calificaciones/GenerarRankingUseCase');
const generarRanking = new GenerarRankingUseCase(repoCalificaciones);

// === IMPORTS PARA SOLICITUDES DE RECALIFICACIÓN ===
const SolicitudRepository = require('./infraestructura/SolicitudRepository');
const ListarSolicitudesUseCase = require('./aplicacion/solicitudes/ListarSolicitudesUseCase');
const CrearSolicitudUseCase = require('./aplicacion/solicitudes/CrearSolicitudUseCase');
const ActualizarSolicitudUseCase = require('./aplicacion/solicitudes/ActualizarSolicitudUseCase');
const EmailService = require('./infraestructura/EmailService');
const repoSolicitudes = new SolicitudRepository();
const emailService = new EmailService();
const listarSolicitudes = new ListarSolicitudesUseCase(repoSolicitudes);
const crearSolicitud = new CrearSolicitudUseCase(repoSolicitudes);
const actualizarSolicitud = new ActualizarSolicitudUseCase(repoSolicitudes, emailService);

// === IMPORTS PARA CURSO-ASIGNATURAS ===
const CursoAsignaturaRepository = require('./infraestructura/CursoAsignaturaRepository');
const ListarCursoAsignaturasUseCase = require('./aplicacion/curso_asignaturas/ListarCursoAsignaturasUseCase');
const CrearCursoAsignaturaUseCase = require('./aplicacion/curso_asignaturas/CrearCursoAsignaturaUseCase');
const EliminarCursoAsignaturaUseCase = require('./aplicacion/curso_asignaturas/EliminarCursoAsignaturaUseCase');
const repoCursoAsignaturas = new CursoAsignaturaRepository();
const listarCursoAsignaturas = new ListarCursoAsignaturasUseCase(repoCursoAsignaturas);
const crearCursoAsignatura = new CrearCursoAsignaturaUseCase(repoCursoAsignaturas);
const eliminarCursoAsignatura = new EliminarCursoAsignaturaUseCase(repoCursoAsignaturas);

// === IMPORTS PARA PARAMETROS ===
const ParametroRepository = require('./infraestructura/ParametroRepository');
const ListarParametrosUseCase = require('./aplicacion/parametros/ListarParametrosUseCase');
const CrearParametroUseCase = require('./aplicacion/parametros/CrearParametroUseCase');
const ActualizarParametroUseCase = require('./aplicacion/parametros/ActualizarParametroUseCase');
const EliminarParametroUseCase = require('./aplicacion/parametros/EliminarParametroUseCase');
const repoParametros = new ParametroRepository();
const listarParametros = new ListarParametrosUseCase(repoParametros);
const crearParametro = new CrearParametroUseCase(repoParametros);
const actualizarParametro = new ActualizarParametroUseCase(repoParametros);
const eliminarParametro = new EliminarParametroUseCase(repoParametros);

// === IMPORTS PARA AUDITORÍA ===
const AuditoriaRepository = require('./infraestructura/AuditoriaRepository');
const ListarAuditoriaUseCase = require('./aplicacion/auditoria/ListarAuditoriaUseCase');
const repoAuditoria = new AuditoriaRepository();
const listarAuditoria = new ListarAuditoriaUseCase(repoAuditoria);

// === IMPORTS PARA ACTIVIDADES ACADÉMICAS ===
const ActividadRepository = require('./infraestructura/ActividadRepository');
const ListarActividadesUseCase = require('./aplicacion/actividades/ListarActividadesUseCase');
const CrearActividadUseCase = require('./aplicacion/actividades/CrearActividadUseCase');
const ActualizarActividadUseCase = require('./aplicacion/actividades/ActualizarActividadUseCase');
const EliminarActividadUseCase = require('./aplicacion/actividades/EliminarActividadUseCase');
const repoActividades = new ActividadRepository();
const listarActividades = new ListarActividadesUseCase(repoActividades);
const crearActividad = new CrearActividadUseCase(repoActividades);
const actualizarActividad = new ActualizarActividadUseCase(repoActividades);
const eliminarActividad = new EliminarActividadUseCase(repoActividades);
    
// === IMPORTS PARA SINCRONIZADOR MOODLE ===
const MoodleService = require('./infraestructura/MoodleService');
const SincronizarMoodleUseCase = require('./aplicacion/moodle/SincronizarMoodleUseCase');
const SincronizacionManualMoodleUseCase = require('./aplicacion/moodle/SincronizacionManualMoodleUseCase');
const moodleService = new MoodleService();
// Inyectamos el servicio de Moodle y el repositorio de Calificaciones
const sincronizarMoodle = new SincronizarMoodleUseCase(moodleService, repoCalificaciones);
const sincronizacionManualMoodle = new SincronizacionManualMoodleUseCase(moodleService);
const SincronizarActividadDocenteUseCase = require('./aplicacion/moodle/SincronizarActividadDocenteUseCase');
const sincronizarActividadDocente = new SincronizarActividadDocenteUseCase(repoActividades, repoCalificaciones, repoUsuarios, repoAsignaturas, moodleService, emailService);
const CalcularPromedioAsignaturaUseCase = require('./aplicacion/calificaciones/CalcularPromedioAsignaturaUseCase');
const calcularPromedioAsignatura = new CalcularPromedioAsignaturaUseCase(repoMatriculas, repoActividades, repoCalificaciones, repoUsuarios, repoAsignaturas, emailService);
const ModificarCalificacionDocenteUseCase = require('./aplicacion/calificaciones/ModificarCalificacionDocenteUseCase');
const modificarCalificacionDocente = new ModificarCalificacionDocenteUseCase(repoCalificaciones, repoActividades, repoUsuarios, repoAsignaturas, repoAsignaciones, emailService);
const NotificarPromediosFinalesUseCase = require('./aplicacion/notificaciones/NotificarPromediosFinalesUseCase');
const notificarPromediosFinales = new NotificarPromediosFinalesUseCase(repoUsuarios, emailService);

const app = express();  
app.use(cors()); // Permite que Angular se conecte sin problemas de seguridad (CORS)
app.use(express.json({ limit: '50mb' })); // Aumentamos el límite para permitir PDFs
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ================= RUTAS PARA LA ACADEMIA (PROMOCIONES) =================

app.get('/api/promociones', async (req, res) => {
    try {
        const promociones = await listarPromociones.ejecutar();
        res.json(promociones);
    } catch (error) {
        console.error("Error al listar promociones:", error.message);
        res.status(500).json({ error: "Hubo un problema al obtener las promociones" });
    }
});

app.post('/api/promociones', async (req, res) => {
    try {
        const nueva = await crearPromocion.ejecutar(req.body);
        res.status(201).json({ mensaje: "Promoción creada con éxito", promocion: nueva });
    } catch (error) {
        console.error("Error al crear promoción:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/promociones/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const actualizada = await actualizarPromocion.ejecutar(id, req.body);
        res.json({ mensaje: "Promoción actualizada con éxito", promocion: actualizada });
    } catch (error) {
        console.error("Error al actualizar promoción:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/promociones/:id', async (req, res) => {
    try {
        await eliminarPromocion.ejecutar(req.params.id);
        res.json({ mensaje: "Promoción dada de baja (inactiva) con éxito" });
    } catch (error) {
        console.error("Error al eliminar promoción:", error.message);
        res.status(500).json({ error: "Error al eliminar la promoción" });
    }
});

// ================= RUTAS PARA LA ACADEMIA (CURSOS) =================

app.get('/api/cursos', async (req, res) => {
    try {
        res.json(await listarCursos.ejecutar());
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los cursos" });
    }
});

app.post('/api/cursos', async (req, res) => {
    try {
        res.status(201).json(await crearCurso.ejecutar(req.body));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/cursos/:id', async (req, res) => {
    try {
        res.json(await actualizarCurso.ejecutar(req.params.id, req.body));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/cursos/:id', async (req, res) => {
    try {
        res.json(await eliminarCurso.ejecutar(req.params.id));
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el curso" });
    }
});

// ================= RUTAS PARA ASIGNATURAS =================

app.get('/api/asignaturas', async (req, res) => {
    try { res.json(await listarAsignaturas.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener las asignaturas" }); }
});

app.post('/api/asignaturas', async (req, res) => {
    try { res.status(201).json(await crearAsignatura.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/asignaturas/:id', async (req, res) => {
    try { res.json(await actualizarAsignatura.ejecutar(req.params.id, req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/asignaturas/:id', async (req, res) => {
    try { res.json(await eliminarAsignatura.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar la asignatura" }); }
});

// ================= RUTAS PARA PARALELOS =================

app.get('/api/paralelos', async (req, res) => {
    try { res.json(await listarParalelos.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener los paralelos" }); }
});

app.post('/api/paralelos', async (req, res) => {
    try { res.status(201).json(await crearParalelo.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/paralelos/:id', async (req, res) => {
    try { res.json(await actualizarParalelo.ejecutar(req.params.id, req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/paralelos/:id', async (req, res) => {
    try { res.json(await eliminarParalelo.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar el paralelo" }); }
});

// ================= RUTAS PARA USUARIOS =================

app.get('/api/usuarios', async (req, res) => {
    try { res.json(await listarUsuarios.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener los usuarios" }); }
});

app.post('/api/usuarios', async (req, res) => {
    try { res.status(201).json(await crearUsuario.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/usuarios/:id', async (req, res) => {
    try { res.json(await actualizarUsuario.ejecutar(req.params.id, req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/usuarios/:id', async (req, res) => {
    try { res.json(await eliminarUsuario.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar el usuario" }); }
});

app.post('/api/login', async (req, res) => {
    try { res.json(await autenticarUsuario.ejecutar(req.body.cedula, req.body.password)); }
    catch (error) { res.status(401).json({ error: error.message }); }
});

// ================= RUTAS PARA MATRÍCULAS =================

app.get('/api/matriculas', async (req, res) => {
    try { res.json(await listarMatriculas.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener las matrículas" }); }
});

app.post('/api/matriculas', async (req, res) => {
    try { res.status(201).json(await crearMatricula.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/matriculas/:id', async (req, res) => {
    try { res.json(await eliminarMatricula.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar la matrícula" }); }
});

// ================= RUTAS PARA ASIGNACIONES DOCENTES =================

app.get('/api/asignacion-docentes', async (req, res) => {
    try { res.json(await listarAsignaciones.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener las asignaciones de docentes" }); }
});

app.post('/api/asignacion-docentes', async (req, res) => {
    try { res.status(201).json(await crearAsignacion.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/asignacion-docentes/:id', async (req, res) => {
    try { res.json(await eliminarAsignacion.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar la asignación" }); }
});

// ================= RUTAS PARA CALIFICACIONES =================

app.get('/api/calificaciones', async (req, res) => {
    try { res.json(await listarCalificaciones.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener las calificaciones" }); }
});

app.post('/api/calificaciones', async (req, res) => {
    try { res.status(201).json(await crearCalificacion.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/calificaciones/:id', async (req, res) => {
    try { res.json(await actualizarCalificacion.ejecutar(req.params.id, req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/calificaciones/:id', async (req, res) => {
    try { res.json(await eliminarCalificacion.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar la calificación" }); }
});

// ================= RUTAS PARA SOLICITUDES DE RECALIFICACIÓN =================
app.get('/api/solicitudes', async (req, res) => {
    try { res.json(await listarSolicitudes.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener solicitudes" }); }
});

app.post('/api/solicitudes', async (req, res) => {
    try { res.status(201).json(await crearSolicitud.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/solicitudes/:id', async (req, res) => {
    try { res.json(await actualizarSolicitud.ejecutar(req.params.id, req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

// ================= RUTAS PARA CURSO-ASIGNATURAS =================
app.get('/api/curso-asignaturas', async (req, res) => {
    try { res.json(await listarCursoAsignaturas.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener las asignaciones de materias" }); }
});

app.post('/api/curso-asignaturas', async (req, res) => {
    try { res.status(201).json(await crearCursoAsignatura.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: "Esta asignatura ya ha sido asignada a este curso." }); }
});

app.delete('/api/curso-asignaturas/:id', async (req, res) => {
    try { res.json(await eliminarCursoAsignatura.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar la asignación" }); }
});

// ================= RUTA DEL MOTOR DE CÁLCULO =================
app.get('/api/ranking', async (req, res) => {
    try { res.json(await generarRanking.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al generar el ranking" }); }
});

// ================= RUTAS PARA PARAMETROS =================
app.get('/api/parametros', async (req, res) => {
    try { res.json(await listarParametros.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener parametros" }); }
});
app.post('/api/parametros', async (req, res) => {
    try { res.status(201).json(await crearParametro.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});
app.put('/api/parametros/:id', async (req, res) => {
    try { res.json(await actualizarParametro.ejecutar(req.params.id, req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});
app.delete('/api/parametros/:id', async (req, res) => {
    try { res.json(await eliminarParametro.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar parámetro" }); }
});

// ================= RUTA PARA AUDITORÍA =================
app.get('/api/auditoria', async (req, res) => {
    try { res.json(await listarAuditoria.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener la auditoría" }); }
});

// ================= RUTAS PARA ACTIVIDADES ACADÉMICAS =================
app.get('/api/actividades', async (req, res) => {
    try { res.json(await listarActividades.ejecutar()); }
    catch (error) { res.status(500).json({ error: "Error al obtener actividades" }); }
});

app.post('/api/actividades', async (req, res) => {
    try { res.status(201).json(await crearActividad.ejecutar(req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/actividades/:id', async (req, res) => {
    try { res.json(await actualizarActividad.ejecutar(req.params.id, req.body)); }
    catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/actividades/:id', async (req, res) => {
    try { res.json(await eliminarActividad.ejecutar(req.params.id)); }
    catch (error) { res.status(500).json({ error: "Error al eliminar actividad" }); }
});

// ================= RUTAS PARA SINCRONIZACIÓN MANUAL MOODLE =================
app.post('/api/sincronizacion/manual', async (req, res) => {
    try {
        // Le pasamos el req.body que contiene promocion_id, tipo_recurso y id_moodle
        const reporte = await sincronizacionManualMoodle.ejecutar(req.body);
        res.json(reporte);
    } catch (error) {
        console.error("Error en sincronización manual:", error.message);
        res.status(400).json({ error: error.message });
    }
});

// ================= RUTAS PARA DOCENTES =================
app.post('/api/docente/sincronizar-actividad', async (req, res) => {
    try {
        const resultado = await sincronizarActividadDocente.ejecutar(req.body);
        res.json(resultado);
    } catch (error) {
        console.error("Error al sincronizar actividad del docente:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/docente/calcular-promedio', async (req, res) => {
    try {
        const resultado = await calcularPromedioAsignatura.ejecutar(req.body);
        res.json(resultado);
    } catch (error) {
        console.error("Error al calcular promedio:", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/docente/modificar-calificacion', async (req, res) => {
    try {
        const resultado = await modificarCalificacionDocente.ejecutar(req.body);
        res.json(resultado);
    } catch (error) {
        console.error("Error al modificar la calificación (docente):", error.message);
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/director/notificar-promedios-finales', async (req, res) => {
    try {
        const resultado = await notificarPromediosFinales.ejecutar(req.body);
        res.json(resultado);
    } catch (error) {
        console.error("Error al notificar promedios finales:", error.message);
        res.status(400).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
    
    // ================= TAREAS PROGRAMADAS (CRON JOBS) =================
    // El formato '0 2 * * *' significa: Ejecutar todos los días a las 02:00 AM
    // Para hacer pruebas y ver que funciona, puedes cambiarlo a '*/1 * * * *' (se ejecutará cada minuto)
    cron.schedule('0 2 * * *', async () => {
        console.log("⏰ [Cron] Disparando tarea de sincronización programada...");
        try {
            await sincronizarMoodle.ejecutar();
        } catch (error) {
            console.error("❌ [Cron] Error fatal en el sincronizador:", error.message);
        }
    });
    console.log("⏱️ Sincronizador de Moodle programado para las 02:00 AM.");

    // ================= RESPALDO AUTOMÁTICO DE BASE DE DATOS =================
    // El formato '0 3 * * 0' significa: Ejecutar todos los domingos a las 03:00 AM
    cron.schedule('0 3 * * 0', () => {
        console.log("🗄️ [Backup] Iniciando respaldo automático de la base de datos...");
        const fecha = new Date().toISOString().split('T')[0]; // Ej: 2024-10-25
        const archivoBackup = `backup_aee_${fecha}.sql`;
        
        // Usamos el comando mysqldump nativo de XAMPP para exportar todo
        exec(`mysqldump -u root aee_academico > ${archivoBackup}`, (error) => {
            if (error) console.error("❌ [Backup] Error al crear el respaldo:", error.message);
            else console.log(`✅ [Backup] Respaldo creado exitosamente: ${archivoBackup}`);
        });
    });
    console.log("⏱️ Respaldo de Base de Datos programado para los domingos a las 03:00 AM.");
});
