import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  // Aquí guardaremos los datos que lleguen de tu Node.js
  servidores: any[] = []; 
  servidoresFiltrados: any[] = []; // Aquí guardaremos los resultados de la consulta

  constructor(private http: HttpClient) {}

  // Esta función arranca solita cuando abres la página
  ngOnInit() {
    this.obtenerDatosDelBackend();
  }

  obtenerDatosDelBackend() {
    // Angular va a la dirección de tu API a pedir el reporte
    this.http.get<any[]>('http://localhost:3000/api/reporte')
      .subscribe({
        next: (datos) => {
          this.servidores = datos;
          this.servidoresFiltrados = datos; // Al arrancar, mostramos toda la lista
          console.log("Datos recibidos con éxito:", this.servidores);
        },
        error: (error) => {
          console.error("Ups! Falló la conexión con Node.js", error);
        }
      });
  }

  consultar(termino: string) {
    if (!termino.trim()) {
      this.servidoresFiltrados = this.servidores;
    } else {
      this.servidoresFiltrados = this.servidores.filter(servidor => 
        servidor.nombre.toLowerCase().includes(termino.toLowerCase())
      );
    }
  }

  crearServidor() {
    const nombre = prompt('Ingrese el nombre del nuevo servidor:');
    if (!nombre) return; // Si cancela o deja vacío, no hacemos nada
    const nota1 = Number(prompt('Ingrese la nota 1:'));
    const nota2 = Number(prompt('Ingrese la nota 2:'));
    const nota3 = Number(prompt('Ingrese la nota 3:'));

    const nuevoServidor = { nombre: nombre, notas: [nota1, nota2, nota3] };

    this.http.post('http://localhost:3000/api/servidores', nuevoServidor).subscribe({
      next: () => {
        alert('Servidor creado con éxito');
        this.obtenerDatosDelBackend(); // Actualizamos la lista
      },
      error: (err) => console.error('Error al crear:', err)
    });
  }

  editarServidor(servidorActual: any) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre:', servidorActual.nombre);
    if (!nuevoNombre) return;
    const nota1 = Number(prompt('Ingrese la nueva nota 1:'));
    const nota2 = Number(prompt('Ingrese la nueva nota 2:'));
    const nota3 = Number(prompt('Ingrese la nueva nota 3:'));

    const datosActualizados = { nombre: nuevoNombre, notas: [nota1, nota2, nota3] };

    this.http.put(`http://localhost:3000/api/servidores/${servidorActual.nombre}`, datosActualizados).subscribe({
      next: () => {
        alert('Servidor actualizado con éxito');
        this.obtenerDatosDelBackend(); // Actualizamos la lista
      },
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  eliminarServidor(nombre: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`)) {
      this.http.delete(`http://localhost:3000/api/servidores/${nombre}`).subscribe({
        next: () => {
          alert('Servidor eliminado');
          this.obtenerDatosDelBackend(); // Actualizamos la lista
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}
