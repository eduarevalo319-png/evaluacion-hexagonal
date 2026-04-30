const express = require('express');
const router = express.Router();
const docenteController = require('../controllers/docenteController');

// Ruta para el panel docente
// POST /api/docente/sincronizar-actividad
router.post('/sincronizar-actividad', docenteController.sincronizarActividad);

// Aquí irían otras rutas del docente, como la de calcular promedio, etc.
// router.post('/calcular-promedio', ...);

module.exports = router;