import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class App implements OnInit {
  
  servidores: any[] = []; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerDatosDelBackend();
  }

  obtenerDatosDelBackend() {
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
