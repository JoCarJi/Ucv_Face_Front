import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = 'https://192.168.18.3:5000/asistencia';

  constructor(private http: HttpClient) { }

  generarAsistencia(fechaInicio: string, fechaFin: string, idUsuario: number): Observable<Blob> {
    const body = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      idUsuario: idUsuario
    };
    return this.http.post(this.apiUrl, body, { responseType: 'blob' });
  }
}