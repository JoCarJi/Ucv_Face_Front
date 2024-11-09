import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserReportResponse } from '../interfaces/intReporte/UserReportResponse';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private urlbase = 'https://192.168.18.3:5000';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserReportResponse[]>{
    return this.http.get<UserReportResponse[]>
    (`${this.urlbase}/all_users`);
  }

  pdfMarcasGeneral(fechaInicio: string, fechaFin: string): Observable<Blob>{
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin      
    };

    return this.http.post(`${this.urlbase}/marcas_general`, body, { responseType: 'blob' });
  }

  pdfMarcasUser(fechaInicio: string, fechaFin: string, idUsuario: number): Observable<Blob> {
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin,
      idUser: idUsuario
    };
    return this.http.post(`${this.urlbase}/marcas_user`, body, { responseType: 'blob' });
  }

  pdfMinTardeFecha(fechaInicio: string, fechaFin: string): Observable<Blob>{
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin      
    };

    return this.http.post(`${this.urlbase}/minutos_tarde_fecha`, body, { responseType: 'blob' });
    
  }

  pdfMinTardeUser(fechaInicio: string, fechaFin: string, idUsuario: number): Observable<Blob> {
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin,
      idUser: idUsuario
    };
    return this.http.post(`${this.urlbase}/minutos_tarde_user`, body, { responseType: 'blob' });
  }

  pdfFaltasUser(fechaInicio: string, fechaFin: string, idUsuario: number, ){
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin,
      idUser: idUsuario
    };
    return this.http.post(`${this.urlbase}/falta_user`, body, { responseType: 'blob' });
  }
  pdfFaltasGeneral(fechaInicio: string, fechaFin: string){
    const body = {
      ini_date: fechaInicio,
      fin_date: fechaFin
    };
    return this.http.post(`${this.urlbase}/falta_general`, body, { responseType: 'blob' });
  }

}
