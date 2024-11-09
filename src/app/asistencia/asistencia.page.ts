import { Component, ViewChild } from '@angular/core';
import { IonDatetime } from '@ionic/angular';
import { AsistenciaService } from 'src/services/asistencia.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage {
  @ViewChild('fechaInicio', { static: false }) fechaInicio!: IonDatetime;
  @ViewChild('fechaFin', { static: false }) fechaFin!: IonDatetime;

  constructor(private asistenciaService: AsistenciaService, private authService: AuthService) {}

  verAsistencia() {
    const fechaInicioValue = this.fechaInicio.value as string;
    const fechaFinValue = this.fechaFin.value as string;

    if (fechaInicioValue && fechaFinValue) {
      const fechaInicioDate = new Date(fechaInicioValue);
      const fechaFinDate = new Date(fechaFinValue);

      if (fechaInicioDate > fechaFinDate) {
        console.error('La fecha y hora de inicio no puede ser posterior a la fecha y hora de fin');
        return;
      }

      const idUsuario = this.authService.getUserId();

      if (idUsuario === null) {
        console.error('Usuario no autenticado');
        return;
      }

      this.asistenciaService.generarAsistencia(fechaInicioValue, fechaFinValue, idUsuario)
        .subscribe((response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'reporte_asistencia.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        }, error => {
          console.error('Error al generar el PDF:', error);
        });
    } else {
      console.error('Por favor seleccione ambas fechas');
    }
  }
}