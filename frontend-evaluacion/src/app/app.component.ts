import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  
  // Aquí guardaremos los datos que lleguen de tu Node.js
  servidores: any[] = []; 

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
          console.log("Datos recibidos con éxito:", this.servidores);
        },
        error: (error) => {
          console.error("Ups! Falló la conexión con Node.js", error);
        }
      });
  }
}
