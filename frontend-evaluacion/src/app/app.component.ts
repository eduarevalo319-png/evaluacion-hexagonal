import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';
import Swal from 'sweetalert2';

Chart.register(...registerables);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  procesando = false; // Bloquea los botones de guardar para evitar doble clic

  // === VARIABLES PARA LOGIN ===
  usuarioActual: any = null;
  cedulaLogin: string = '';
  passwordLogin: string = '';

  // === VARIABLES PARA RANKING (SUSTITUYE A SERVIDORES) ===
  ranking: any[] = []; 
  rankingFiltrado: any[] = [];
  graficoRanking: any = null; // Guardará la instancia de nuestro gráfico
  graficoPromedios: any = null; // Guardará la instancia del gráfico de barras
  filtroMateriaGrafico: string = ''; // Guardará la materia seleccionada para los gráficos
  filtroCursoGrafico: string = ''; // Guardará el curso seleccionado
  terminoBusqueda: string = ''; // Guardará el texto de la barra de búsqueda
  timeoutGrafico: any = null; // Evita que los gráficos colisionen al teclear rápido

  // === NUEVAS VARIABLES PARA LA ACADEMIA (PROMOCIONES) ===
  vistaActual: 'ranking' | 'promociones' | 'cursos' | 'asignaturas' | 'paralelos' | 'usuarios' | 'matriculas' | 'asignaciones' | 'calificaciones' | 'solicitudes' | 'curso-asignaturas' | 'auditoria' | 'actividades' | 'sincronizacion' | 'panel-docente' | 'parametros' | 'modificar-nota' | 'reporte-consolidado' | 'mis-calificaciones' = 'ranking'; 
  promociones: any[] = [];
  mostrarModalPromocion = false;
  nuevaPromocion: any = { id: null, nombre: '', anio: new Date().getFullYear() };

  // === VARIABLES PARA CURSOS ===
  cursos: any[] = [];
  mostrarModalCurso = false;
  nuevoCurso: any = { id: null, promocion_id: '', nombre: '', fecha_inicio: '', fecha_fin: '', numero_autorizacion: '', estado_academico: 'EN ESPERA', acta_resolucion_pdf: '' };

  // === VARIABLES PARA ASIGNATURAS Y PARALELOS === 
  asignaturas: any[] = [];
  mostrarModalAsignatura = false;
  nuevaAsignatura: any = { id: null, nombre: '' };

  paralelos: any[] = [];
  mostrarModalParalelo = false;
  nuevoParalelo: any = { id: null, curso_id: '', nombre: '' };

  // === VARIABLES PARA USUARIOS ===
  usuarios: any[] = [];
  mostrarModalUsuario = false;
  nuevoUsuario: any = { id: null, cedula: '', nombres: '', apellidos: '', correo: '', rol: '' };

  // === VARIABLES PARA MATRÍCULAS ===
  matriculas: any[] = [];
  estudiantes: any[] = []; // Solo guardará usuarios con rol ESTUDIANTE
  mostrarModalMatricula = false;
  nuevaMatricula: any = { id: null, paralelo_id: '', estudiante_id: '' };

  // === VARIABLES PARA ASIGNACIÓN DE DOCENTES ===
  asignaciones: any[] = [];
  docentes: any[] = []; // Solo guardará usuarios con rol DOCENTE
  mostrarModalAsignacion = false;
  nuevaAsignacion: any = { id: null, paralelo_id: '', asignatura_id: '', docente_id: '' };

  // === VARIABLES PARA CALIFICACIONES ===
  calificaciones: any[] = [];
  mostrarModalCalificacion = false;
  nuevaCalificacion: any = { id: null, paralelo_id: '', asignatura_id: '', estudiante_id: '', nota: '', motivo: '' };

  // === VARIABLES PARA SOLICITUDES DE RECALIFICACIÓN ===
  solicitudes: any[] = [];
  mostrarModalSolicitud = false;
  modoModalSolicitud: 'crear' | 'responder' = 'crear';
  nuevaSolicitud: any = { id: null, calificacion_id: '', motivo: '', respuesta: '', estado: '' };

  // === VARIABLES PARA CURSO-ASIGNATURAS ===
  cursoAsignaturas: any[] = [];
  mostrarModalCursoAsignatura = false;
  nuevoCursoAsignatura: any = { curso_id: '', asignatura_id: '' };

  // === VARIABLES PARA AUDITORÍA ===
  auditorias: any[] = [];

  // === VARIABLES PARA ACTIVIDADES ===
  actividades: any[] = [];
  mostrarModalActividad = false;
  nuevaActividad: any = { id: null, asignatura_id: '', id_moodle: '', nombre: '', caracteristica: 'CUANTITATIVA', descripcion: '' };

  // === VARIABLES PARA SINCRONIZACIÓN MOODLE ===
  parametrosSync: any = { promocion_id: '', tipo_recurso: '', id_moodle: '' };
  reporteSincronizacion: any[] = [];

  // === VARIABLES PARA MODIFICACIÓN DE NOTAS (DOCENTE) ===
  datosModificacion: any = {
    cedula: '',
    estudianteEncontrado: null,
    asignatura_id: '',
    actividad_id: '',
    calificacionActual: null,
    nota_nueva: '',
    observacion: ''
  };
  asignaturasModificacion: any[] = [];
  actividadesModificacion: any[] = [];

  // === VARIABLES PARA PARAMETROS ===
  parametros: any[] = [];
  estadosPromocion: any[] = [];
  caracteristicasActividad: any[] = [];
  mostrarModalParametro = false;
  nuevoParametro: any = { id: null, tipo: '', nombre: '' };

  // === VARIABLES PARA PANEL DOCENTE ===
  docentePromociones: any[] = [];
  docenteAsignaturas: any[] = [];
  docenteParalelos: any[] = [];
  docenteActividades: any[] = [];
  docenteEstudiantes: any[] = [];
  docenteFiltros: any = {
    promocion_id: '',
    asignatura_id: '',
    paralelo_id: '',
    actividad_id: ''
  };

  // === VARIABLES PARA REPORTE CONSOLIDADO ===
  filtroReportePromocion: string = '';
  reporteAsignaturas: any[] = [];
  reporteData: any[] = [];

  // === VARIABLES PARA VISTA ESTUDIANTE ===
  miLibreta: any = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  // Esta función arranca solita cuando abres la página
  ngOnInit() {
    // Sobrescribimos el alert nativo para usar SweetAlert2 (No bloquea la pantalla)
    window.alert = (mensaje?: any) => {
      const msg = String(mensaje || '');
      let icono: 'success' | 'error' | 'warning' | 'info' = 'info';
      
      if (msg.toLowerCase().includes('error') || msg.toLowerCase().includes('ocurrió') || msg.toLowerCase().includes('denegado')) {
          icono = 'error';
      } else if (msg.toLowerCase().includes('éxito') || msg.toLowerCase().includes('bienvenido') || msg.toLowerCase().includes('completada') || msg.toLowerCase().includes('correctamente') || msg.toLowerCase().includes('enviadas')) {
          icono = 'success';
      } else {
          icono = 'warning';
      }

      // Se envuelve en setTimeout para no interrumpir ni bloquear el ciclo de detección de Angular
      setTimeout(() => {
        try {
          if (icono === 'success') {
            // Mensaje tipo "Toast" flotante en la esquina que no estorba y desaparece solo
            Swal.fire({ toast: true, position: 'top-end', icon: icono, title: msg, showConfirmButton: false, timer: 3000, timerProgressBar: true });
          } else {
            // Pop-up estático central obligatorio para los errores y advertencias
            Swal.fire({ text: msg, icon: icono, confirmButtonColor: '#2b6cb0', confirmButtonText: 'Aceptar' });
          }
        } catch (error) {
          console.warn("Mensaje del Sistema:", msg);
        }
      }, 10);
    };

    // Verificamos si ya hay una sesión guardada
    const sesionGuardada = localStorage.getItem('usuarioActual');
    if (sesionGuardada) {
      this.usuarioActual = JSON.parse(sesionGuardada);
    }

    this.obtenerRanking();
    this.obtenerPromociones();
    this.obtenerCursos();
    this.obtenerAsignaturas();
    this.obtenerParalelos();
    this.obtenerUsuarios();
    this.obtenerMatriculas();
    this.obtenerAsignaciones();
    this.obtenerCalificaciones();
    this.obtenerCursoAsignaturas();
    this.obtenerSolicitudes();
    this.obtenerActividades();
    this.obtenerAuditoria();
    this.obtenerParametros();
  }

  // ================= LÓGICA DE LOGIN =================
  iniciarSesion() {
    if (!this.cedulaLogin.trim() || !this.passwordLogin.trim()) return alert("Ingrese su cédula y contraseña.");
    this.procesando = true;
    this.http.post<any>('http://localhost:3000/api/login', { cedula: this.cedulaLogin, password: this.passwordLogin }).subscribe({
      next: (usuario) => {
        this.procesando = false;
        alert(`¡Bienvenido/a al sistema, ${usuario.nombres} ${usuario.apellidos}!`);
        this.usuarioActual = usuario;
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        // Redirigir a vista específica si es estudiante
        if (usuario.rol === 'ESTUDIANTE') {
          this.cambiarVista('mis-calificaciones');
        } else {
          this.cambiarVista('ranking');
        }
            this.cdr.detectChanges(); // 🔥 Obliga a la pantalla a actualizarse inmediatamente
      },
      error: (err) => {
        this.procesando = false;
        alert(err.error?.error || "Error al iniciar sesión.");
            this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion() {
    this.usuarioActual = null;
    this.cedulaLogin = '';
    this.passwordLogin = '';
    localStorage.removeItem('usuarioActual');
        this.cdr.detectChanges(); // 🔥 Obliga a actualizar al cerrar sesión
  }

  // ================= LÓGICA DE RANKING =================
  obtenerRanking() {
    this.http.get<any[]>('http://localhost:3000/api/ranking')
      .subscribe({
        next: (datos) => {
          this.ranking = datos;
          this.aplicarFiltros();
        },
        error: (error) => console.error("Error al obtener ranking", error)
      });
  }

  aplicarFiltros() {
    let datosBase = [];

    // 1. Filtrar por Materia
    if (this.filtroMateriaGrafico === '') {
      datosBase = [...this.ranking];
    } else {
      const notasMateria = this.calificaciones.filter(c => c.asignatura_nombre === this.filtroMateriaGrafico);
      const mapa: any = {};
      
      notasMateria.forEach(c => {
        const key = `${c.estudiante_id}-${c.curso_nombre}`;
        if (!mapa[key]) {
          mapa[key] = { cedula: c.cedula, apellidos_nombres: `${c.est_apellidos} ${c.est_nombres}`, curso_nombre: c.curso_nombre, notas: [], final: null, estadoFinal: '' };
        }
        
        if (c.actividad_id === null) {
            mapa[key].final = Number(c.nota);
            mapa[key].estadoFinal = c.observacion;
        } else if (c.actividad_nombre && !c.actividad_nombre.toUpperCase().includes('SUPLETORIO')) {
            mapa[key].notas.push(Number(c.nota));
        }
      });

      datosBase = Object.values(mapa).map((est: any) => {
        let promedio = 0;
        let estadoStr = '';
        
        if (est.final !== null) {
            promedio = est.final;
            estadoStr = est.estadoFinal;
        } else if (est.notas.length > 0) {
            const suma = est.notas.reduce((a: number, b: number) => a + b, 0);
            promedio = suma / est.notas.length;
            estadoStr = promedio >= 14 ? 'APROBADO' : 'REPROBADO';
        }
        
        if (estadoStr === 'APROBADO' || estadoStr === 'APTO' || estadoStr === 'APTO PARA ASCENSO') estadoStr = 'APTO PARA ASCENSO';
        else estadoStr = 'REPROBADO';
        
        return { ...est, promedio, estado: estadoStr };
      });
    }

    // 2. Filtrar por Curso
    if (this.filtroCursoGrafico !== '') {
      datosBase = datosBase.filter(est => est.curso_nombre === this.filtroCursoGrafico);
    }

    // 3. Re-calcular Antigüedades sobre los datos filtrados
    datosBase.sort((a, b) => b.promedio - a.promedio);
    let rank = 1;
    datosBase.forEach((est, index) => {
      if (index > 0 && est.promedio < datosBase[index - 1].promedio) rank = index + 1;
      est.antiguedad = rank;
    });

    // 4. Aplicar Búsqueda por Texto
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase();
      this.rankingFiltrado = datosBase.filter(est => est.apellidos_nombres.toLowerCase().includes(termino) || est.cedula.includes(termino));
    } else {
      this.rankingFiltrado = datosBase;
    }

    // Destruir gráficos síncronamente ANTES de que Angular actualice el DOM (evita el bug de ResizeObserver de Chart.js)
    if (this.graficoRanking) { this.graficoRanking.destroy(); this.graficoRanking = null; }
    if (this.graficoPromedios) { this.graficoPromedios.destroy(); this.graficoPromedios = null; }

    if (this.timeoutGrafico) clearTimeout(this.timeoutGrafico);
    this.timeoutGrafico = setTimeout(() => this.generarGrafico(), 100);
  }

  descargarPDF() {
    const doc = new jsPDF();
    doc.text('Reporte Final de Antigüedades y Ascenso', 14, 15);
    
    // Convertimos nuestros datos JSON en un arreglo de arreglos para la tabla del PDF
    const datosTabla = this.rankingFiltrado.map(est => [
      `#${est.antiguedad}`,
      est.cedula,
      est.apellidos_nombres.toUpperCase(),
      est.curso_nombre,
      this.filtroMateriaGrafico ? this.filtroMateriaGrafico : 'TODAS',
      Number(est.promedio).toFixed(2),
      est.estado
    ]);

    autoTable(doc, {
      startY: 20,
      head: [['Antigüedad', 'Cédula', 'Apellidos y Nombres', 'Curso', 'Asignatura', 'Promedio', 'Condición']],
      body: datosTabla,
    });

    doc.save('ranking_antiguedades.pdf');
  }

  generarGrafico() {
    if (this.vistaActual !== 'ranking') return;

    if (this.rankingFiltrado.length === 0) return; // Evita que Chart.js colapse si la tabla está vacía

    const canvas = document.getElementById('graficoCanvas') as HTMLCanvasElement;
    const canvasBarras = document.getElementById('graficoPromediosCanvas') as HTMLCanvasElement;
    
    // Si Angular aún no ha renderizado los canvas en el DOM, reintentamos un momento después
    if (!canvas || !canvasBarras) {
      this.timeoutGrafico = setTimeout(() => this.generarGrafico(), 50);
      return; 
    }
    
    if (this.graficoRanking) { this.graficoRanking.destroy(); }
    if (this.graficoPromedios) { this.graficoPromedios.destroy(); }

    const aptos = this.rankingFiltrado.filter(r => r.estado === 'APTO PARA ASCENSO').length;
    const reprobados = this.rankingFiltrado.filter(r => r.estado === 'REPROBADO').length;


    this.graficoRanking = new Chart(canvas, {
      type: 'doughnut', // Gráfico circular tipo "Dona"
      data: {
        labels: ['Aptos para Ascenso', 'Reprobados'],
        datasets: [{
          data: [aptos, reprobados],
          backgroundColor: ['#48bb78', '#e53e3e'],
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    const promediosPorCurso: any = {};
    this.rankingFiltrado.forEach(est => {
      if (!promediosPorCurso[est.curso_nombre]) promediosPorCurso[est.curso_nombre] = { suma: 0, cantidad: 0 };
      promediosPorCurso[est.curso_nombre].suma += est.promedio;
      promediosPorCurso[est.curso_nombre].cantidad += 1;
    });

    const labelsCursos = Object.keys(promediosPorCurso);
    const dataPromedios = labelsCursos.map(curso => {
      return (promediosPorCurso[curso].suma / promediosPorCurso[curso].cantidad).toFixed(2);
    });

    this.graficoPromedios = new Chart(canvasBarras, {
      type: 'bar',
      data: {
        labels: labelsCursos,
        datasets: [{
          label: 'Promedio General / 20',
          data: dataPromedios,
          backgroundColor: '#2b6cb0',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 20 }
        }
      }
    });
  }

  // ================= LÓGICA DE LA ACADEMIA (PROMOCIONES) =================
  
  cambiarVista(vista: 'ranking' | 'promociones' | 'cursos' | 'asignaturas' | 'paralelos' | 'usuarios' | 'matriculas' | 'asignaciones' | 'calificaciones' | 'solicitudes' | 'curso-asignaturas' | 'auditoria' | 'actividades' | 'sincronizacion' | 'panel-docente' | 'parametros' | 'modificar-nota' | 'reporte-consolidado' | 'mis-calificaciones') {
    this.vistaActual = vista;
    if (vista === 'ranking') {
      this.aplicarFiltros();
    } else if (vista === 'panel-docente') {
      this.cargarPanelDocente();
    } else if (vista === 'mis-calificaciones') {
      this.generarMiLibreta();
    }
  }

  obtenerPromociones() {
    this.http.get<any[]>('http://localhost:3000/api/promociones').subscribe({
      next: (datos) => this.promociones = datos,
      error: (err) => console.error("Error al obtener promociones:", err)
    });
  }

  abrirModalPromocion(promo: any = null) {
    if (promo) {
      // Modo Editar: Copiamos los datos existentes
      this.nuevaPromocion = { id: promo.id, nombre: promo.nombre, anio: promo.anio };
    } else {
      // Modo Crear: Limpiamos el formulario
      this.nuevaPromocion = { id: null, nombre: '', anio: new Date().getFullYear() };
    }
    this.mostrarModalPromocion = true;
  }

  cerrarModalPromocion() {
    this.mostrarModalPromocion = false;
  }

  guardarPromocion() {
    if (!this.nuevaPromocion.nombre || !this.nuevaPromocion.anio) {
      alert('Por favor ingrese el nombre y el año de la promoción.');
      return;
    }
    
    const payload = { nombre: this.nuevaPromocion.nombre, anio: Number(this.nuevaPromocion.anio) };

    this.procesando = true;
    if (this.nuevaPromocion.id) {
      // Lógica para ACTUALIZAR
      this.http.put(`http://localhost:3000/api/promociones/${this.nuevaPromocion.id}`, payload).subscribe({
        next: () => {
          this.procesando = false;
          this.cerrarModalPromocion();
          this.obtenerPromociones();
          alert('Promoción actualizada con éxito.');
        },
        error: (err) => {
          this.procesando = false;
          console.error('Error al actualizar promoción:', err);
        }
      });
    } else {
      // Lógica para CREAR
      this.http.post('http://localhost:3000/api/promociones', payload).subscribe({
        next: () => {
          this.procesando = false;
          this.cerrarModalPromocion();
          this.obtenerPromociones();
          alert('Promoción creada con éxito.');
        },
        error: (err) => {
          this.procesando = false;
          console.error('Error al crear promoción:', err);
        }
      });
    }
  }

  eliminarPromocion(id: number) {
    const confirmar = confirm("¿Está seguro de que desea inactivar esta promoción? Desaparecerá de esta lista activa.");
    if (!confirmar) return;

    this.http.delete(`http://localhost:3000/api/promociones/${id}`).subscribe({
      next: () => {
        this.obtenerPromociones();
        alert('Promoción inactivada con éxito.');
      },
      error: (err) => console.error('Error al eliminar promoción:', err)
    });
  }

  // ================= LÓGICA DE LA ACADEMIA (CURSOS) =================

  obtenerCursos() {
    this.http.get<any[]>('http://localhost:3000/api/cursos').subscribe({
      next: (datos) => this.cursos = datos,
      error: (err) => console.error("Error al obtener cursos:", err)
    });
  }

  abrirModalCurso(curso: any = null) {
    if (curso) {
      // Formatear las fechas para que el input type="date" las reconozca (YYYY-MM-DD)
      const formatoFecha = (fecha: any) => fecha ? new Date(fecha).toISOString().split('T')[0] : '';
      
      this.nuevoCurso = {
        id: curso.id,
        promocion_id: curso.promocion_id,
        nombre: curso.nombre,
        fecha_inicio: formatoFecha(curso.fecha_inicio),
        fecha_fin: formatoFecha(curso.fecha_fin),
        numero_autorizacion: curso.numero_autorizacion || '',
        estado_academico: curso.estado_academico || 'EN ESPERA',
        acta_resolucion_pdf: curso.acta_resolucion_pdf || ''
      };
    } else {
      this.nuevoCurso = { id: null, promocion_id: '', nombre: '', fecha_inicio: '', fecha_fin: '', numero_autorizacion: '', estado_academico: 'EN ESPERA', acta_resolucion_pdf: '' };
    }
    this.mostrarModalCurso = true;
  }

  cerrarModalCurso() {
    this.mostrarModalCurso = false;
  }

  guardarCurso() {
    if (!this.nuevoCurso.promocion_id || !this.nuevoCurso.nombre || !this.nuevoCurso.estado_academico) {
      alert('Por favor seleccione una promoción, un estado académico y escriba el nombre del curso.');
      return;
    }

    // Preparamos el objeto convirtiendo el ID a número y enviando null si la fecha está vacía
    const payload = {
      promocion_id: Number(this.nuevoCurso.promocion_id),
      nombre: this.nuevoCurso.nombre,
      fecha_inicio: this.nuevoCurso.fecha_inicio || null,
      fecha_fin: this.nuevoCurso.fecha_fin || null,
      numero_autorizacion: this.nuevoCurso.numero_autorizacion,
      estado_academico: this.nuevoCurso.estado_academico,
      acta_resolucion_pdf: this.nuevoCurso.acta_resolucion_pdf
    };

    this.procesando = true;
    const peticion = this.nuevoCurso.id 
      ? this.http.put(`http://localhost:3000/api/cursos/${this.nuevoCurso.id}`, payload)
      : this.http.post('http://localhost:3000/api/cursos', payload);

    peticion.subscribe({
      next: () => {
        this.procesando = false;
        this.cerrarModalCurso();
        this.obtenerCursos();
        alert('Curso guardado con éxito.');
      },
      error: (err) => {
        this.procesando = false;
        console.error('Error al guardar curso:', err);
      }
    });
  }

  eliminarCurso(id: number) {
    if (!confirm("¿Está seguro de que desea inactivar este curso?")) return;

    this.http.delete(`http://localhost:3000/api/cursos/${id}`).subscribe({
      next: () => {
        this.obtenerCursos();
        alert('Curso inactivado con éxito.');
      },
      error: (err) => console.error('Error al eliminar curso:', err)
    });
  }

  onArchivoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      return alert('Por favor, seleccione únicamente un archivo PDF.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return alert('El archivo es demasiado grande. El máximo permitido es 5MB.');
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => { this.nuevoCurso.acta_resolucion_pdf = reader.result; };
    reader.onerror = (error) => { console.error('Error:', error); alert('Error al procesar el PDF.'); };
  }

  verPDF(base64String: string) {
    if (!base64String) return alert('No hay ningún documento adjunto.');
    const ventana = window.open();
    if (ventana) ventana.document.write(`<iframe width="100%" height="100%" style="border:none; margin:0; padding:0;" src="${base64String}"></iframe>`);
    else alert('Por favor permita las ventanas emergentes (pop-ups) en su navegador para visualizar el PDF.');
  }

  // ================= LÓGICA DE ASIGNATURAS =================

  obtenerAsignaturas() {
    this.http.get<any[]>('http://localhost:3000/api/asignaturas').subscribe({
      next: (datos) => this.asignaturas = datos,
      error: (err) => console.error("Error al obtener asignaturas:", err)
    });
  }

  abrirModalAsignatura(asig: any = null) {
    if (asig) {
      this.nuevaAsignatura = { id: asig.id, nombre: asig.nombre };
    } else {
      this.nuevaAsignatura = { id: null, nombre: '' };
    }
    this.mostrarModalAsignatura = true;
  }

  cerrarModalAsignatura() { this.mostrarModalAsignatura = false; }

  guardarAsignatura() {
    if (!this.nuevaAsignatura.nombre) return alert('El nombre es obligatorio.');
    const payload = { nombre: this.nuevaAsignatura.nombre };
    
    this.procesando = true;
    const peticion = this.nuevaAsignatura.id 
      ? this.http.put(`http://localhost:3000/api/asignaturas/${this.nuevaAsignatura.id}`, payload)
      : this.http.post('http://localhost:3000/api/asignaturas', payload);

    peticion.subscribe({
      next: () => {
        this.procesando = false;
        this.cerrarModalAsignatura();
        this.obtenerAsignaturas();
        alert('Asignatura guardada con éxito.');
      },
      error: (err) => {
        this.procesando = false;
        console.error('Error al guardar asignatura:', err);
      }
    });
  }

  eliminarAsignatura(id: number) {
    if (!confirm("¿Inactivar esta asignatura?")) return;
    this.http.delete(`http://localhost:3000/api/asignaturas/${id}`).subscribe({
      next: () => {
        this.obtenerAsignaturas();
        alert('Asignatura inactivada con éxito.');
      },
      error: (err) => console.error('Error al eliminar asignatura:', err)
    });
  }

  // ================= LÓGICA DE PARALELOS =================

  obtenerParalelos() {
    this.http.get<any[]>('http://localhost:3000/api/paralelos').subscribe({
      next: (datos) => this.paralelos = datos,
      error: (err) => console.error("Error al obtener paralelos:", err)
    });
  }

  abrirModalParalelo(paralelo: any = null) {
    if (paralelo) {
      this.nuevoParalelo = { id: paralelo.id, curso_id: paralelo.curso_id, nombre: paralelo.nombre };
    } else {
      this.nuevoParalelo = { id: null, curso_id: '', nombre: '' };
    }
    this.mostrarModalParalelo = true;
  }

  cerrarModalParalelo() { this.mostrarModalParalelo = false; }

  guardarParalelo() {
    if (!this.nuevoParalelo.curso_id || !this.nuevoParalelo.nombre) {
      return alert('Debe seleccionar un curso y escribir el nombre del paralelo (ej. A).');
    }
    const payload = { 
      curso_id: Number(this.nuevoParalelo.curso_id), 
      nombre: this.nuevoParalelo.nombre 
    };

    this.procesando = true;
    const peticion = this.nuevoParalelo.id 
      ? this.http.put(`http://localhost:3000/api/paralelos/${this.nuevoParalelo.id}`, payload)
      : this.http.post('http://localhost:3000/api/paralelos', payload);

    peticion.subscribe({
      next: () => {
        this.procesando = false;
        this.cerrarModalParalelo();
        this.obtenerParalelos();
        alert('Paralelo guardado con éxito.');
      },
      error: (err) => {
        this.procesando = false;
        console.error('Error al guardar paralelo:', err);
      }
    });
  }

  eliminarParalelo(id: number) {
    if (!confirm("¿Inactivar este paralelo?")) return;
    this.http.delete(`http://localhost:3000/api/paralelos/${id}`).subscribe({
      next: () => {
        this.obtenerParalelos();
        alert('Paralelo inactivado con éxito.');
      },
      error: (err) => console.error('Error al eliminar paralelo:', err)
    });
  }

  // ================= LÓGICA DE USUARIOS =================

  obtenerUsuarios() {
    this.http.get<any[]>('http://localhost:3000/api/usuarios').subscribe({
      next: (datos) => {
        this.usuarios = datos;
        this.estudiantes = datos.filter(u => u.rol === 'ESTUDIANTE');
        this.docentes = datos.filter(u => u.rol === 'DOCENTE');
      },
      error: (err) => console.error("Error al obtener usuarios:", err)
    });
  }

  abrirModalUsuario(usuario: any = null) {
    if (usuario) {
      this.nuevoUsuario = { id: usuario.id, cedula: usuario.cedula, nombres: usuario.nombres, apellidos: usuario.apellidos, correo: usuario.correo, rol: usuario.rol };
    } else {
      this.nuevoUsuario = { id: null, cedula: '', nombres: '', apellidos: '', correo: '', rol: '' };
    }
    this.mostrarModalUsuario = true;
  }

  cerrarModalUsuario() { this.mostrarModalUsuario = false; }

  guardarUsuario() {
    if (!this.nuevoUsuario.cedula || !this.nuevoUsuario.nombres || !this.nuevoUsuario.apellidos || !this.nuevoUsuario.rol) {
      return alert('Cédula, nombres, apellidos y rol son obligatorios.');
    }
    const payload = { ...this.nuevoUsuario };

    this.procesando = true;
    const peticion = this.nuevoUsuario.id 
      ? this.http.put(`http://localhost:3000/api/usuarios/${this.nuevoUsuario.id}`, payload)
      : this.http.post('http://localhost:3000/api/usuarios', payload);

    peticion.subscribe({
      next: () => {
        this.procesando = false;
        this.cerrarModalUsuario();
        this.obtenerUsuarios();
        alert('Usuario guardado con éxito.');
      },
      error: (err) => {
        this.procesando = false;
        alert(err.error?.error || 'Ocurrió un error inesperado al guardar el usuario.');
      }
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm("¿Inactivar este usuario?")) return;
    this.http.delete(`http://localhost:3000/api/usuarios/${id}`).subscribe({
      next: () => {
        this.obtenerUsuarios();
        alert('Usuario inactivado con éxito.');
      },
      error: (err) => console.error('Error al eliminar usuario:', err)
    });
  }

  // ================= LÓGICA DE MATRÍCULAS =================

  obtenerMatriculas() {
    this.http.get<any[]>('http://localhost:3000/api/matriculas').subscribe({
      next: (datos) => this.matriculas = datos,
      error: (err) => console.error("Error al obtener matrículas:", err)
    });
  }

  abrirModalMatricula() {
    this.nuevaMatricula = { id: null, paralelo_id: '', estudiante_id: '' };
    this.mostrarModalMatricula = true;
  }

  cerrarModalMatricula() { this.mostrarModalMatricula = false; }

  guardarMatricula() {
    if (!this.nuevaMatricula.paralelo_id || !this.nuevaMatricula.estudiante_id) {
      return alert('Debe seleccionar un paralelo y un estudiante.');
    }
    const payload = { paralelo_id: Number(this.nuevaMatricula.paralelo_id), estudiante_id: Number(this.nuevaMatricula.estudiante_id) };
    this.procesando = true;
    this.http.post('http://localhost:3000/api/matriculas', payload).subscribe({
      next: () => {
        this.procesando = false;
        this.cerrarModalMatricula();
        this.obtenerMatriculas();
        alert('Matrícula registrada con éxito.');
      },
      error: (err) => {
        this.procesando = false;
        alert(err.error?.error || 'Ocurrió un error al matricular.');
      }
    });
  }

  eliminarMatricula(id: number) {
    if (!confirm("¿Está seguro de que desea anular esta matrícula?")) return;
    this.http.delete(`http://localhost:3000/api/matriculas/${id}`).subscribe({
      next: () => {
        this.obtenerMatriculas();
        alert('Matrícula anulada con éxito.');
      },
      error: (err) => console.error('Error al anular matrícula:', err)
    });
  }

  // ================= LÓGICA DE ASIGNACIÓN DE DOCENTES =================

  obtenerAsignaciones() {
    this.http.get<any[]>('http://localhost:3000/api/asignacion-docentes').subscribe({
      next: (datos) => this.asignaciones = datos,
      error: (err) => console.error("Error al obtener asignaciones:", err)
    });
  }

  abrirModalAsignacion() {
    this.nuevaAsignacion = { id: null, paralelo_id: '', asignatura_id: '', docente_id: '' };
    this.mostrarModalAsignacion = true;
  }

  cerrarModalAsignacion() { this.mostrarModalAsignacion = false; }

  guardarAsignacion() {
    if (!this.nuevaAsignacion.paralelo_id || !this.nuevaAsignacion.asignatura_id || !this.nuevaAsignacion.docente_id) {
      return alert('Debe seleccionar un paralelo, una asignatura y un docente.');
    }
    const payload = { 
      paralelo_id: Number(this.nuevaAsignacion.paralelo_id), 
      asignatura_id: Number(this.nuevaAsignacion.asignatura_id),
      docente_id: Number(this.nuevaAsignacion.docente_id)
    };
    this.procesando = true;
    this.http.post('http://localhost:3000/api/asignacion-docentes', payload).subscribe({
      next: () => {
        this.procesando = false;
        this.cerrarModalAsignacion();
        this.obtenerAsignaciones();
        alert('Docente asignado con éxito.');
      },
      error: (err) => {
        this.procesando = false;
        alert(err.error?.error || 'Ocurrió un error en la asignación.');
      }
    });
  }

  eliminarAsignacion(id: number) {
    if (!confirm("¿Está seguro de que desea anular esta asignación?")) return;
    this.http.delete(`http://localhost:3000/api/asignacion-docentes/${id}`).subscribe({
      next: () => {
        this.obtenerAsignaciones();
        alert('Asignación docente anulada con éxito.');
      },
      error: (err) => console.error('Error al anular asignación:', err)
    });
  }

  // ================= LÓGICA DE CALIFICACIONES =================

  obtenerCalificaciones() {
    this.http.get<any[]>('http://localhost:3000/api/calificaciones').subscribe({
      next: (datos) => this.calificaciones = datos,
      error: (err) => console.error("Error al obtener calificaciones:", err)
    });
  }

  obtenerEstudiantesPorParalelo(paraleloId: any) {
    if (!paraleloId) return [];
    return this.matriculas.filter(m => m.paralelo_id == paraleloId);
  }

  abrirModalCalificacion(cal: any = null) {
    if (cal) {
      this.nuevaCalificacion = { id: cal.id, paralelo_id: cal.paralelo_id, asignatura_id: cal.asignatura_id, estudiante_id: cal.estudiante_id, nota: cal.nota, motivo: '' };
    } else {
      this.nuevaCalificacion = { id: null, paralelo_id: '', asignatura_id: '', estudiante_id: '', nota: '', motivo: '' };
    }
    this.mostrarModalCalificacion = true;
  }

  cerrarModalCalificacion() { this.mostrarModalCalificacion = false; }

  guardarCalificacion() {
    if (!this.nuevaCalificacion.paralelo_id || !this.nuevaCalificacion.asignatura_id || !this.nuevaCalificacion.estudiante_id || this.nuevaCalificacion.nota === '') {
      return alert('Todos los campos son obligatorios para registrar una nota.');
    }
    
    this.procesando = true;
    
    if (this.nuevaCalificacion.id) {
      if (!this.nuevaCalificacion.motivo) {
        this.procesando = false;
        return alert("Debe especificar un motivo para la auditoría al cambiar una nota.");
      }
      const payload = { nota_nueva: Number(this.nuevaCalificacion.nota), motivo: this.nuevaCalificacion.motivo, usuario_id: this.usuarioActual.id };
      this.http.put(`http://localhost:3000/api/calificaciones/${this.nuevaCalificacion.id}`, payload).subscribe({
        next: () => { this.procesando = false; this.cerrarModalCalificacion(); this.obtenerCalificaciones(); this.obtenerRanking(); alert('Nota modificada correctamente.'); },
        error: (err) => { this.procesando = false; alert(err.error?.error || 'Error al actualizar la nota.'); }
      });
    } else {
      const payload = { paralelo_id: Number(this.nuevaCalificacion.paralelo_id), asignatura_id: Number(this.nuevaCalificacion.asignatura_id), estudiante_id: Number(this.nuevaCalificacion.estudiante_id), nota: Number(this.nuevaCalificacion.nota) };
      this.http.post('http://localhost:3000/api/calificaciones', payload).subscribe({
        next: () => { this.procesando = false; this.cerrarModalCalificacion(); this.obtenerCalificaciones(); this.obtenerRanking(); alert('Calificación registrada con éxito.'); },
        error: (err) => { this.procesando = false; alert(err.error?.error || 'Error al registrar la nota.'); }
      });
    }
  }

  eliminarCalificacion(id: number) {
    if (!confirm("¿Está seguro de que desea anular esta calificación?")) return;
    this.http.delete(`http://localhost:3000/api/calificaciones/${id}`).subscribe({
      next: () => {
        this.obtenerCalificaciones();
        alert('Calificación anulada con éxito.');
      },
      error: (err) => console.error('Error al anular calificación:', err)
    });
  }

  // ================= LÓGICA DE SOLICITUDES DE RECALIFICACIÓN =================

  obtenerSolicitudes() {
    this.http.get<any[]>('http://localhost:3000/api/solicitudes').subscribe({
      next: (datos) => this.solicitudes = datos,
      error: (err) => console.error("Error al obtener solicitudes:", err)
    });
  }

  abrirModalCrearSolicitud() {
    this.modoModalSolicitud = 'crear';
    this.nuevaSolicitud = { id: null, calificacion_id: '', motivo: '', respuesta: '', estado: '' };
    this.mostrarModalSolicitud = true;
  }

  abrirModalResponderSolicitud(sol: any) {
    this.modoModalSolicitud = 'responder';
    const estadoVis = (sol.estado === 'PENDIENTE' && this.usuarioActual?.rol !== 'ESTUDIANTE') ? 'APROBADA' : sol.estado;
    this.nuevaSolicitud = { id: sol.id, calificacion_id: sol.calificacion_id, motivo: sol.motivo, respuesta: sol.respuesta || '', estado: estadoVis };
    this.mostrarModalSolicitud = true;
  }

  cerrarModalSolicitud() { this.mostrarModalSolicitud = false; }

  guardarSolicitud() {
    this.procesando = true;
    if (this.modoModalSolicitud === 'crear') {
      const calSelected = this.calificaciones.find(c => c.id == this.nuevaSolicitud.calificacion_id);
      if (!calSelected || !this.nuevaSolicitud.motivo) {
        this.procesando = false;
        return alert("Seleccione una calificación y escriba un motivo.");
      }
      const payload = { calificacion_id: Number(this.nuevaSolicitud.calificacion_id), estudiante_id: Number(calSelected.estudiante_id), motivo: this.nuevaSolicitud.motivo };
      this.http.post('http://localhost:3000/api/solicitudes', payload).subscribe({
        next: () => { this.procesando = false; this.cerrarModalSolicitud(); this.obtenerSolicitudes(); alert('Solicitud de recalificación enviada con éxito.'); },
        error: (err) => { this.procesando = false; alert(err.error?.error || "Error al crear solicitud."); }
      });
    } else {
      if (!this.nuevaSolicitud.respuesta || !this.nuevaSolicitud.estado) {
        this.procesando = false;
        return alert("Debe escribir una respuesta y cambiar el estado.");
      }
      const payload = { respuesta: this.nuevaSolicitud.respuesta, estado: this.nuevaSolicitud.estado };
      this.http.put(`http://localhost:3000/api/solicitudes/${this.nuevaSolicitud.id}`, payload).subscribe({
        next: () => { this.procesando = false; this.cerrarModalSolicitud(); this.obtenerSolicitudes(); alert('Respuesta a la solicitud registrada con éxito.'); },
        error: (err) => { this.procesando = false; alert(err.error?.error || "Error al responder solicitud."); }
      });
    }
  }

  // ================= LÓGICA DE CURSO-ASIGNATURAS =================

  obtenerCursoAsignaturas() {
    this.http.get<any[]>('http://localhost:3000/api/curso-asignaturas').subscribe({
      next: (datos) => this.cursoAsignaturas = datos,
      error: (err) => console.error("Error al obtener asignaciones de materias:", err)
    });
  }

  abrirModalCursoAsignatura() {
    this.nuevoCursoAsignatura = { curso_id: '', asignatura_id: '' };
    this.mostrarModalCursoAsignatura = true;
  }

  cerrarModalCursoAsignatura() { this.mostrarModalCursoAsignatura = false; }

  guardarCursoAsignatura() {
    if (!this.nuevoCursoAsignatura.curso_id || !this.nuevoCursoAsignatura.asignatura_id) {
      return alert('Debe seleccionar un curso y una asignatura.');
    }
    this.procesando = true;
    this.http.post('http://localhost:3000/api/curso-asignaturas', this.nuevoCursoAsignatura).subscribe({
      next: () => { this.procesando = false; this.cerrarModalCursoAsignatura(); this.obtenerCursoAsignaturas(); alert('Materia vinculada al curso con éxito.'); },
      error: (err) => { this.procesando = false; alert(err.error?.error || 'Error al asignar materia.'); }
    });
  }

  eliminarCursoAsignatura(id: number) {
    if (!confirm("¿Está seguro de que desea quitar esta materia del curso?")) return;
    this.http.delete(`http://localhost:3000/api/curso-asignaturas/${id}`).subscribe({
      next: () => {
        this.obtenerCursoAsignaturas();
        alert('Asignatura desvinculada del curso.');
      },
      error: (err) => console.error('Error al quitar materia:', err)
    });
  }

  // ================= LÓGICA DE AUDITORÍA =================

  obtenerAuditoria() {
    this.http.get<any[]>('http://localhost:3000/api/auditoria').subscribe({
      next: (datos) => this.auditorias = datos,
      error: (err) => console.error("Error al obtener la auditoría:", err)
    });
  }

  // ================= LÓGICA DE ACTIVIDADES =================

  obtenerActividades() {
    this.http.get<any[]>('http://localhost:3000/api/actividades').subscribe({
      next: (datos) => this.actividades = datos,
      error: (err) => console.error("Error al obtener actividades:", err)
    });
  }

  abrirModalActividad(act: any = null) {
    if (act) {
      this.nuevaActividad = { id: act.id, asignatura_id: act.asignatura_id, id_moodle: act.id_moodle, nombre: act.nombre, caracteristica: act.caracteristica, descripcion: act.descripcion || '' };
    } else {
      this.nuevaActividad = { id: null, asignatura_id: '', id_moodle: '', nombre: '', caracteristica: 'CUANTITATIVA', descripcion: '' };
    }
    this.mostrarModalActividad = true;
  }

  cerrarModalActividad() { this.mostrarModalActividad = false; }

  guardarActividad() {
    if (!this.nuevaActividad.asignatura_id || !this.nuevaActividad.nombre || !this.nuevaActividad.caracteristica) {
      return alert('La asignatura, el nombre y la característica son obligatorios.');
    }
    const payload = { ...this.nuevaActividad, asignatura_id: Number(this.nuevaActividad.asignatura_id) };
    
    this.procesando = true;
    const peticion = this.nuevaActividad.id 
      ? this.http.put(`http://localhost:3000/api/actividades/${this.nuevaActividad.id}`, payload)
      : this.http.post('http://localhost:3000/api/actividades', payload);

    peticion.subscribe({
      next: () => { this.procesando = false; this.cerrarModalActividad(); this.obtenerActividades(); alert('Actividad académica guardada con éxito.'); },
      error: (err) => { this.procesando = false; alert(err.error?.error || 'Error al guardar la actividad.'); }
    });
  }

  eliminarActividad(id: number) {
    if (!confirm("¿Está seguro de que desea eliminar esta actividad?")) return;
    this.http.delete(`http://localhost:3000/api/actividades/${id}`).subscribe({
      next: () => {
        this.obtenerActividades();
        alert('Actividad académica eliminada con éxito.');
      },
      error: (err) => console.error('Error al eliminar actividad:', err)
    });
  }

  // ================= LÓGICA DE SINCRONIZACIÓN MANUAL =================
  
  ejecutarSincronizacion() {
    if (!this.parametrosSync.promocion_id || !this.parametrosSync.tipo_recurso || !this.parametrosSync.id_moodle) {
      return alert('Debe seleccionar la promoción, el tipo de recurso y escribir el número de ID de Moodle.');
    }
    this.procesando = true;
    this.http.post<any[]>('http://localhost:3000/api/sincronizacion/manual', this.parametrosSync).subscribe({
      next: (reporte) => { this.procesando = false; this.reporteSincronizacion = reporte; alert('Sincronización completada.'); },
      error: (err) => { this.procesando = false; alert(err.error?.error || 'Ocurrió un error al intentar sincronizar con Moodle.'); }
    });
  }

  // ================= LÓGICA DE MODIFICACIÓN DE NOTA (DOCENTE) =================

  buscarEstudiantePorCedulaParaModificacion() {
    this.datosModificacion.estudianteEncontrado = null;
    this.asignaturasModificacion = [];
    this.actividadesModificacion = [];
    this.datosModificacion.calificacionActual = null;
    
    const ced = this.datosModificacion.cedula.trim();
    if (!ced) return;

    const estudiante = this.usuarios.find(u => u.cedula === ced && u.rol === 'ESTUDIANTE');
    if (!estudiante) return alert("Estudiante no encontrado en el sistema.");

    const matricula = this.matriculas.find(m => m.estudiante_id === estudiante.id);
    if (!matricula) return alert("El estudiante no tiene matrículas activas en ninguna promoción actual.");

    this.datosModificacion.estudianteEncontrado = { ...estudiante, curso_nombre: matricula.curso_nombre, paralelo_nombre: matricula.paralelo_nombre, paralelo_id: matricula.paralelo_id };

    const paralelo = this.paralelos.find(p => p.id === matricula.paralelo_id);
    
    let asigIds = new Set<number>();
    
    if (this.usuarioActual.rol === 'DOCENTE') {
      // Filtrar asignaturas ligadas estrictamente al docente logueado Y al paralelo del alumno
      const misAsignaciones = this.asignaciones.filter(a => a.docente_id === this.usuarioActual.id && a.paralelo_id === matricula.paralelo_id);
      asigIds = new Set(misAsignaciones.map(a => a.asignatura_id));
    } else {
      // ADMIN o DIRECTOR pueden modificar cualquier nota del curso del estudiante
      const cursoAsig = this.cursoAsignaturas.filter(ca => ca.curso_id === paralelo?.curso_id);
      asigIds = new Set(cursoAsig.map(ca => ca.asignatura_id));
    }
    
    this.asignaturasModificacion = this.asignaturas.filter(a => asigIds.has(a.id));
    
    if (this.asignaturasModificacion.length === 0) {
        alert(this.usuarioActual.rol === 'DOCENTE' ? "Usted no tiene asignaturas asignadas a este estudiante." : "No hay asignaturas configuradas para el curso de este estudiante.");
    }
  }

  alSeleccionarAsignaturaModificacion() {
    this.datosModificacion.actividad_id = '';
    this.datosModificacion.calificacionActual = null;
    this.actividadesModificacion = this.actividades.filter(act => act.asignatura_id === Number(this.datosModificacion.asignatura_id));
  }

  alSeleccionarActividadModificacion() {
    const cal = this.calificaciones.find(c => c.estudiante_id === this.datosModificacion.estudianteEncontrado.id && c.asignatura_id === Number(this.datosModificacion.asignatura_id) && c.actividad_id === Number(this.datosModificacion.actividad_id));
    this.datosModificacion.calificacionActual = cal || null;
    if (!cal) alert("El estudiante aún no tiene ninguna calificación registrada en esta actividad.");
  }

  guardarModificacionNota() {
    if (!this.datosModificacion.calificacionActual) return alert("No hay calificación disponible para modificar.");
    const notaNueva = Number(this.datosModificacion.nota_nueva);
    
    if (isNaN(notaNueva)) return alert("La nota debe ser un valor numérico válido (admite 3 decimales).");

    const actividad = this.actividadesModificacion.find(a => a.id === Number(this.datosModificacion.actividad_id));
    const esSupletorio = actividad && actividad.nombre.toUpperCase().includes('SUPLETORIO');

    if (esSupletorio && (notaNueva < 0 || notaNueva > 14)) return alert("❌ Reglamentario: La nota del Supletorio solo permite un máximo de 14.000.");
    if (!esSupletorio && (notaNueva < 0 || notaNueva > 20)) return alert("❌ Rango Inválido: La calificación regular debe estar entre 0.000 y 20.000.");
    if (!this.datosModificacion.observacion || this.datosModificacion.observacion.length > 500) return alert("Debe ingresar una observación válida de máximo 500 caracteres como respaldo de auditoría.");

    if (!confirm(`¿Confirma la modificación definitiva de esta calificación a ${notaNueva.toFixed(3)}?`)) return;

    this.procesando = true;
    const payload = { calificacion_id: this.datosModificacion.calificacionActual.id, nota_nueva: notaNueva, observacion: this.datosModificacion.observacion, docente_id: this.usuarioActual.id };

    this.http.post<any>('http://localhost:3000/api/docente/modificar-calificacion', payload).subscribe({
      next: (res) => {
        this.procesando = false; alert(res.mensaje || "Registro modificado");
        this.obtenerCalificaciones(); this.obtenerAuditoria();
        this.datosModificacion = { cedula: '', estudianteEncontrado: null, asignatura_id: '', actividad_id: '', calificacionActual: null, nota_nueva: '', observacion: '' };
      },
      error: (err) => { this.procesando = false; alert(err.error?.error || "Error en el servidor al intentar modificar la nota."); }
    });
  }

  // ================= LÓGICA DE PARAMETROS =================
  obtenerParametros() {
    this.http.get<any[]>('http://localhost:3000/api/parametros').subscribe({
      next: (datos) => {
        this.parametros = datos;
        this.estadosPromocion = datos.filter(p => p.tipo === 'ESTADO_PROMOCION');
        this.caracteristicasActividad = datos.filter(p => p.tipo === 'CARACTERISTICA_ACTIVIDAD');
      },
      error: (err) => console.error("Error al obtener parametros:", err)
    });
  }

  abrirModalParametro(param: any = null) {
    if (param) {
      this.nuevoParametro = { id: param.id, tipo: param.tipo, nombre: param.nombre };
    } else {
      this.nuevoParametro = { id: null, tipo: 'ESTADO_PROMOCION', nombre: '' };
    }
    this.mostrarModalParametro = true;
  }

  cerrarModalParametro() { this.mostrarModalParametro = false; }

  guardarParametro() {
    if (!this.nuevoParametro.tipo || !this.nuevoParametro.nombre) return alert('Tipo y nombre son obligatorios.');
    this.procesando = true;
    const peticion = this.nuevoParametro.id
      ? this.http.put(`http://localhost:3000/api/parametros/${this.nuevoParametro.id}`, this.nuevoParametro)
      : this.http.post('http://localhost:3000/api/parametros', this.nuevoParametro);

    peticion.subscribe({
      next: () => { this.procesando = false; this.cerrarModalParametro(); this.obtenerParametros(); alert('Parámetro guardado con éxito.'); },
      error: (err) => { this.procesando = false; alert(err.error?.error || 'Error al guardar parámetro'); }
    });
  }

  eliminarParametro(id: number) {
    if (!confirm("¿Está seguro de inactivar este parámetro?")) return;
    this.http.delete(`http://localhost:3000/api/parametros/${id}`).subscribe({
      next: () => {
        this.obtenerParametros();
        alert('Parámetro inactivado con éxito.');
      },
      error: (err) => console.error('Error al eliminar parámetro:', err)
    });
  }

  // ================= LÓGICA DE PANEL DOCENTE =================
  cargarPanelDocente() {
    this.docentePromociones = [...this.promociones];
    this.docenteFiltros = { promocion_id: '', asignatura_id: '', paralelo_id: '', actividad_id: '' };
    this.docenteAsignaturas = [];
    this.docenteParalelos = [];
    this.docenteActividades = [];
    this.docenteEstudiantes = [];
  }

  alSeleccionarPromocionDocente() {
    this.docenteFiltros.asignatura_id = '';
    this.docenteFiltros.paralelo_id = '';
    this.docenteFiltros.actividad_id = '';
    this.docenteParalelos = [];
    this.docenteActividades = [];
    this.docenteEstudiantes = [];

    if (!this.docenteFiltros.promocion_id) {
      this.docenteAsignaturas = [];
      return;
    }
    const misAsignaciones = this.asignaciones.filter(a => a.docente_id === this.usuarioActual.id);
    const asigIds = new Set(misAsignaciones.map(a => a.asignatura_id));
    this.docenteAsignaturas = this.asignaturas.filter(a => asigIds.has(a.id));
  }

  alSeleccionarAsignaturaDocente() {
    this.docenteFiltros.paralelo_id = '';
    this.docenteFiltros.actividad_id = '';
    this.docenteActividades = [];
    this.docenteEstudiantes = [];

    if (!this.docenteFiltros.asignatura_id) {
      this.docenteParalelos = [];
      return;
    }
    const misAsignaciones = this.asignaciones.filter(a => a.docente_id === this.usuarioActual.id && a.asignatura_id === Number(this.docenteFiltros.asignatura_id));
    const paraleloIds = new Set(misAsignaciones.map(a => a.paralelo_id));
    this.docenteParalelos = this.paralelos.filter(p => paraleloIds.has(p.id));
    this.docenteActividades = this.actividades.filter(act => act.asignatura_id === Number(this.docenteFiltros.asignatura_id));
  }

  alSeleccionarParaleloDocente() {
    this.docenteFiltros.actividad_id = '';
    if (!this.docenteFiltros.paralelo_id) {
      this.docenteEstudiantes = [];
      return;
    }
    this.docenteEstudiantes = this.matriculas.filter(m => m.paralelo_id === Number(this.docenteFiltros.paralelo_id));
  }

  sincronizarActividadDocente() {
    if (!this.docenteFiltros.asignatura_id || !this.docenteFiltros.paralelo_id || !this.docenteFiltros.actividad_id) return alert("Debe seleccionar asignatura, paralelo y actividad.");
    const actividad = this.actividades.find(a => a.id === Number(this.docenteFiltros.actividad_id));
    if (actividad && actividad.sincronizada) return alert("Esta actividad ya ha sido sincronizada.");
    if (!confirm("Recuerde: Una vez realizado el proceso de sincronización no se podrá realizar modificaciones.\n\n¿Desea continuar?")) return;
    this.procesando = true;
    const payload = { asignatura_id: Number(this.docenteFiltros.asignatura_id), paralelo_id: Number(this.docenteFiltros.paralelo_id), actividad_id: Number(this.docenteFiltros.actividad_id) };
    this.http.post<any>('http://localhost:3000/api/docente/sincronizar-actividad', payload).subscribe({
      next: (res) => { this.procesando = false; alert(res.mensaje || "Sincronización completada."); this.obtenerActividades(); this.obtenerCalificaciones(); setTimeout(() => this.alSeleccionarAsignaturaDocente(), 100); },
      error: (err) => { this.procesando = false; alert(err.error?.error || "Error al sincronizar."); }
    });
  }

  calcularPromedioAsignatura() {
    if (!this.docenteFiltros.asignatura_id || !this.docenteFiltros.paralelo_id) {
      return alert("Debe seleccionar asignatura y paralelo para calcular el promedio.");
    }
    if (!confirm("Recuerde: Una vez realizado el proceso de cálculo no se podrá realizar modificaciones.\n\n¿Desea continuar?")) return;
    this.procesando = true;
    const payload = { asignatura_id: Number(this.docenteFiltros.asignatura_id), paralelo_id: Number(this.docenteFiltros.paralelo_id) };
    this.http.post<any>('http://localhost:3000/api/docente/calcular-promedio', payload).subscribe({
      next: (res) => { this.procesando = false; alert(res.mensaje || "Cálculo completado."); this.obtenerCalificaciones(); },
      error: (err) => { this.procesando = false; alert(err.error?.error || "Error al calcular el promedio."); }
    });
  }

  obtenerNotaEstudianteActividad(estudianteId: number, actividadId: number): string {
    const nota = this.calificaciones.find(c => c.estudiante_id === estudianteId && c.actividad_id === actividadId);
    return nota ? nota.nota : '';
  }

  obtenerPromedioFinalEstudiante(estudianteId: number): any {
    return this.calificaciones.find(c => c.estudiante_id === estudianteId && c.asignatura_id === Number(this.docenteFiltros.asignatura_id) && c.actividad_id === null);
  }

  obtenerClaseObservacion(obs: string): string {
    if (!obs) return '';
    if (obs === 'APROBADO' || obs === 'APTO') return 'badge aprobado';
    if (obs === 'SUPLETORIO') return 'badge';
    return 'badge reprobado';
  }

  get historialModificacionesDocente() {
    if (!this.usuarioActual) return [];
    return this.auditorias.filter(a => a.admin_cedula === this.usuarioActual.cedula);
  }

  // ================= LÓGICA DE REPORTE CONSOLIDADO =================
  
  generarDataReporteConsolidado() {
    if (!this.filtroReportePromocion) return alert('Seleccione una promoción.');
    this.procesando = true;
    
    setTimeout(() => {
      const promId = Number(this.filtroReportePromocion);
      
      // 1. Obtener paralelos y estudiantes de la promoción
      const cursosIds = this.cursos.filter(c => c.promocion_id === promId).map(c => c.id);
      const paralelosIds = this.paralelos.filter(p => cursosIds.includes(p.curso_id)).map(p => p.id);
      const matriculados = this.matriculas.filter(m => paralelosIds.includes(m.paralelo_id));
      
      // 2. Obtener asignaturas únicas de la promoción y clasificar sus actividades (excluyendo supletorio de la iteración normal)
      const asigIds = Array.from(new Set(this.cursoAsignaturas.filter(ca => cursosIds.includes(ca.curso_id)).map(ca => ca.asignatura_id)));
      this.reporteAsignaturas = this.asignaturas.filter(a => asigIds.includes(a.id)).map(a => {
          const acts = this.actividades.filter(act => act.asignatura_id === a.id);
          const actsNormales = acts.filter(act => !act.nombre.toUpperCase().includes('SUPLETORIO'));
          const esCualitativa = acts.some(act => act.caracteristica === 'CUALITATIVA');
          return { ...a, actividades: actsNormales, esCualitativa };
      });

      // 3. Procesar las notas por cada estudiante
      let data = matriculados.map(m => {
          let sumaPromediosCuantitativos = 0;
          let countCuantitativos = 0;
          let apruebaTodo = true;
          let notasPorMateria: any = {};
          
          this.reporteAsignaturas.forEach(asig => {
              const califs = this.calificaciones.filter(c => c.estudiante_id === m.estudiante_id && c.asignatura_id === asig.id);
              
              let promFinalObj = califs.find(c => c.actividad_id === null);
              let promedio = promFinalObj ? Number(promFinalObj.nota) : 0;
              let observacion = promFinalObj ? promFinalObj.observacion : '';
              
              if (promFinalObj && (promedio < 14 || observacion === 'NO APTO')) apruebaTodo = false;
              
              if (!asig.esCualitativa && promFinalObj) {
                  sumaPromediosCuantitativos += promedio;
                  countCuantitativos++;
              }
              
              let notasActs: any = {};
              let notaSupletorio: any = null;
              
              califs.forEach((cal) => {
                  if(cal.actividad_id) {
                      if(cal.actividad_nombre.toUpperCase().includes('SUPLETORIO')) notaSupletorio = cal.nota;
                      else notasActs[cal.actividad_id] = cal.nota;
                  }
              });
              
              const asignacion = this.asignaciones.find(a => a.paralelo_id === m.paralelo_id && a.asignatura_id === asig.id);
              const docenteNombre = asignacion ? `${asignacion.nombres} ${asignacion.apellidos}` : 'Sin Asignar';
              
              notasPorMateria[asig.id] = { docente: docenteNombre, notasActs, supletorio: notaSupletorio, promedio: promFinalObj ? promedio.toFixed(2) : '-', observacion: observacion || '-' };
          });
          
          let promedioFinalGeneral = countCuantitativos > 0 ? (sumaPromediosCuantitativos / countCuantitativos) : 0;
          // Evaluamos si pasó todo y además el promedio final es >= 14, como pide el Excel
          let obsGeneral = (apruebaTodo && countCuantitativos > 0 && promedioFinalGeneral >= 14) ? 'APROBADO' : 'REPROBADO';
          
          return { estudiante_id: m.estudiante_id, cedula: m.cedula, nombres: `${m.apellidos} ${m.nombres}`, paralelo: m.paralelo_nombre, notasMateria: notasPorMateria, promedioGeneral: promedioFinalGeneral, observacionGeneral: obsGeneral, antiguedad: 0 };
      });
      
      // 4. Calcular Antigüedad (Ordenando por promedio general)
      data.sort((a, b) => b.promedioGeneral - a.promedioGeneral);
      let rank = 1;
      data.forEach((d, i) => {
        if (i > 0 && d.promedioGeneral < data[i - 1].promedioGeneral) {
          rank = i + 1; // Si el promedio es menor que el anterior, baja de puesto, si no, se repite el puesto
        }
        d.antiguedad = rank;
      });
      
      this.reporteData = data;
      this.procesando = false;
    }, 400); // Simulamos carga para UX
  }

  obtenerFechaActual(): string { return new Date().toLocaleString(); }

  exportarExcelReporte() {
    const table = document.getElementById("tabla-reporte-consolidado");
    if(!table) return;
    
    // Construimos la estructura XML de Excel para que respete los estilos y los colspans
    const html = table.outerHTML;
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Reporte Consolidado</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>';
    
    const base64 = (s: any) => window.btoa(unescape(encodeURIComponent(s)));
    const format = (s: any, c: any) => s.replace(/{(\w+)}/g, (m: any, p: any) => c[p]);
    
    const ctx = { table: html };
    const link = document.createElement("a");
    link.download = `Reporte_Consolidado_${new Date().getTime()}.xls`;
    link.href = uri + base64(format(template, ctx));
    link.click();
  }

  exportarPDFReporte() {
    const doc = new jsPDF('l', 'pt', 'a3'); // Landscape A3 para que quepan las columnas
    const marcaAgua = `Generado por: ${this.usuarioActual.nombres} ${this.usuarioActual.apellidos}`;
    
    doc.text('Reporte Académico Consolidado', 40, 30);
    
    autoTable(doc, { html: '#tabla-reporte-consolidado', startY: 40, theme: 'grid', styles: { fontSize: 7, cellPadding: 2 } });
    
    // Agregando la marca de agua diagonal por cada página del PDF
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(150, 150, 150); doc.setFontSize(40);
      doc.text(marcaAgua, doc.internal.pageSize.getWidth() / 4, doc.internal.pageSize.getHeight() / 1.5, { angle: 30, opacity: 0.2 } as any);
    }
    doc.save(`Reporte_Consolidado_${new Date().getTime()}.pdf`);
  }

  notificarPromediosFinales() {
    if (this.reporteData.length === 0) return;
    if (!confirm("🚨 ATENCIÓN: Esta acción procesará y enviará un correo oficial a TODOS los alumnos de esta promoción con su Promedio Final.\n\n¿Desea continuar?")) {
      return;
    }

    this.procesando = true;
    const promocion = this.promociones.find(p => p.id === Number(this.filtroReportePromocion));

    const payload = {
      promocion_nombre: promocion ? promocion.nombre : 'Promoción Actual',
      resultados: this.reporteData.map(r => ({
        estudiante_id: r.estudiante_id,
        promedio: r.promedioGeneral,
        estado: r.observacionGeneral
      }))
    };

    this.http.post<any>('http://localhost:3000/api/director/notificar-promedios-finales', payload).subscribe({
      next: (res) => {
        this.procesando = false;
        alert(res.mensaje || "Notificaciones enviadas con éxito.");
      },
      error: (err) => {
        this.procesando = false;
        alert(err.error?.error || "Ocurrió un error al enviar las notificaciones.");
      }
    });
  }

  // ================= LÓGICA DE VISTA ESTUDIANTE =================
  
  generarMiLibreta() {
    if (this.usuarioActual?.rol !== 'ESTUDIANTE') return;
    const estudianteId = this.usuarioActual.id;
    
    const matricula = this.matriculas.find(m => m.estudiante_id === estudianteId);
    if (!matricula) { this.miLibreta = null; return; }
    
    const paralelo = this.paralelos.find(p => p.id === matricula.paralelo_id);
    const curso = this.cursos.find(c => c.id === paralelo?.curso_id);
    
    const misNotas = this.calificaciones.filter(c => c.estudiante_id === estudianteId);
    const materias: any[] = [];
    const asigIds = Array.from(new Set(misNotas.map(n => n.asignatura_id)));
    
    asigIds.forEach(asigId => {
      const notasAsig = misNotas.filter(n => n.asignatura_id === asigId);
      const asigInfo = this.asignaturas.find(a => a.id === asigId);
      
      let actividades: string[] = [];
      let supletorio = null;
      let promedioFinal = null;
      let observacion = '';
      
      notasAsig.forEach(n => {
         if (n.actividad_id === null) {
             promedioFinal = Number(n.nota).toFixed(2);
             observacion = n.observacion;
         } else if (n.actividad_nombre?.toUpperCase().includes('SUPLETORIO')) {
             supletorio = Number(n.nota).toFixed(2);
         } else {
             actividades.push(`${n.actividad_nombre}: ${Number(n.nota).toFixed(2)}`);
         }
      });
      
      materias.push({ nombre: asigInfo?.nombre || 'Desconocida', actividades: actividades.join(' | '), supletorio: supletorio || '-', promedioFinal: promedioFinal || '-', observacion: observacion || '-' });
    });
    
    this.miLibreta = {
       promocion_nombre: curso?.promocion_nombre || 'No asignada',
       fecha_inicio: curso?.fecha_inicio || null,
       fecha_fin: curso?.fecha_fin || null,
       materias: materias
    };
  }

  descargarPDFMiLibreta() {
    if (!this.miLibreta) return;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Reporte Oficial de Calificaciones del Alumno', 14, 25);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Estudiante: ${this.usuarioActual.nombres.toUpperCase()} ${this.usuarioActual.apellidos.toUpperCase()}`, 14, 40);
    doc.text(`Cédula de Identidad: ${this.usuarioActual.cedula}`, 14, 48);
    doc.text(`Promoción (Nivel 3): ${this.miLibreta.promocion_nombre.toUpperCase()}`, 14, 56);
    
    const formatoFecha = (f: any) => f ? new Date(f).toLocaleDateString() : 'N/D';
    doc.text(`Período Académico: ${formatoFecha(this.miLibreta.fecha_inicio)} al ${formatoFecha(this.miLibreta.fecha_fin)}`, 14, 64);
    
    const datosTabla = this.miLibreta.materias.map((m: any) => [m.nombre, m.actividades, m.supletorio, m.promedioFinal, m.observacion]);
    
    autoTable(doc, { startY: 75, head: [['Asignatura', 'Actividades Regulares', 'Supletorio', 'Prom. Final', 'Observación']], body: datosTabla, styles: { fontSize: 8 }, headStyles: { fillColor: [43, 108, 176] } });
    doc.save(`Reporte_Calificaciones_${this.usuarioActual.cedula}.pdf`);
  }
}
