import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceService {
  private baseUrl = 'https://192.168.18.3:5000'; // Reemplaza con tu URL y puerto

  constructor(private http: HttpClient) { }

  facialLogin(idUser: number | undefined ,imageData: string): Observable<any> {
    const url = `${this.baseUrl}/facial_login`;
    
    const body = { user_id: idUser, image: imageData};

    return this.http.post(url, body);
  }

  marcarEntrada(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/marcar_entrada`, { idUsuario });
  }

  marcarSalida(idUsuario: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/marcar_salida`, { idUsuario });
  }
}