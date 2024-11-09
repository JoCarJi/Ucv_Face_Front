import { Component, OnInit, ViewChild} from '@angular/core';
import { IonDatetime, IonSelect } from '@ionic/angular';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { ReportesService } from 'src/services/reportes.service';
import { UserReportResponse } from '../../interfaces/intReporte/UserReportResponse';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  @ViewChild('fechaInicio', { static: false }) fechaInicio!: IonDatetime;
  @ViewChild('fechaFin', { static: false }) fechaFin!: IonDatetime;
  @ViewChild('userSelect', { static: false }) userSelect!: IonSelect;

  public Users: UserReportResponse [] = [];

  constructor(
    private repSvc: ReportesService,
    private alertCrl: AlertController
  ) { }

  ngOnInit() {
    this.repSvc.getAllUsers()
    .subscribe(User => this.Users.push(...User));
  }

  verMarcaciones(){
    const fechaInicioValue = this.formatDate(this.fechaInicio.value);
    const fechaFinValue = this.formatDate(this.fechaFin.value);
    const idUser = this.userSelect.value as number;

    if (fechaInicioValue && fechaFinValue) {
      if (this.validateDates(fechaInicioValue, fechaFinValue)) {
        if (idUser === undefined || idUser == 0) {
          this.repSvc.pdfMarcasGeneral(fechaInicioValue, fechaFinValue).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_marcas_general.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        } else {
          this.repSvc.pdfMarcasUser(fechaInicioValue, fechaFinValue, idUser).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_marcas_user.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        }
      }
    } else {
      console.error('Por favor, seleccione ambas fechas');
    }
  }

  verTardanzas(){
    const fechaInicioValue = this.formatDate(this.fechaInicio.value);
    const fechaFinValue = this.formatDate(this.fechaFin.value);
    const idUser = this.userSelect.value as number;

    if (fechaInicioValue && fechaFinValue) {
      if (this.validateDates(fechaInicioValue, fechaFinValue)) {
        if (idUser === undefined || idUser == 0) {
          this.repSvc.pdfMinTardeFecha(fechaInicioValue, fechaFinValue).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_min_tarde_fecha.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        } else {
          this.repSvc.pdfMinTardeUser(fechaInicioValue, fechaFinValue, idUser).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_min_tarde_user.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        }
      }
    } else {
      console.error('Por favor, seleccione ambas fechas');
    }
  }

  async verFaltas(){
    const fechaInicioValue = this.formatDate(this.fechaInicio.value);
    const fechaFinValue = this.formatDate(this.fechaFin.value);
    const idUser = this.userSelect.value as number;
    let month: number = 0;
    
    if (fechaInicioValue){
      const fechaInicioDate = new Date(fechaInicioValue);
      const mes = fechaInicioDate.getMonth() + 1
      month = mes;
    }

    if (fechaInicioValue && fechaFinValue) {
      if (this.validateDates(fechaInicioValue, fechaFinValue)) {
        if (idUser === undefined || idUser == 0) {
          this.repSvc.pdfFaltasGeneral(fechaInicioValue, fechaFinValue).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_falta_general.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        } else {
          this.repSvc.pdfFaltasUser(fechaInicioValue, fechaFinValue, idUser).subscribe((response: Blob) => {
            this.downloadBlob(response, 'reporte_falta_user.pdf');
          }, error => {
            console.error('Error al generar el PDF:', error);
          });
        }
      }
    } else {
      console.error('Por favor, seleccione ambas fechas');
    }
  }

  private formatDate(dateStr: string | string[] | null | undefined): string {
    if (!dateStr) {
      return '';
    }
    
    // Extraer directamente la fecha de la cadena sin convertirla a objeto Date
    const date = new Date(dateStr as string);
    
    // Obtener los componentes de la fecha
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
  
    // Devolver en formato 'YYYY-MM-DD'
    return `${year}-${month}-${day}`;
  }

  validateDates(fechaInicio: string, fechaFin: string): boolean {
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);
  
    if (fechaInicioDate > fechaFinDate) {
      console.error('La fecha y hora de inicio no puede ser posterior a la fecha y hora de fin');
      return false;
    }
  
    return true;
  }
  
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
  
}


