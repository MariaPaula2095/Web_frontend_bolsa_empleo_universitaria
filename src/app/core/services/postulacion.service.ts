import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Postulacion } from '../models/postulacion.model';

@Injectable({ providedIn: 'root' })
export class PostulacionService {
  private api = `${environment.apiUrl}/api/postulaciones`;

  constructor(private http: HttpClient) {}

  guardar(postulacion: Postulacion): Observable<any> {
    return this.http.post(`${this.api}/guardar`, postulacion);
  }

  listar(): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.api}/listar`);
  }

  porCandidato(idUsuario: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.api}/candidato/${idUsuario}`);
  }

  porOferta(idOferta: number): Observable<Postulacion[]> {
    return this.http.get<Postulacion[]>(`${this.api}/oferta/${idOferta}`);
  }

  actualizar(id: number, postulacion: Partial<Postulacion>): Observable<any> {
    return this.http.put(`${this.api}/actualizar/${id}`, postulacion);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/eliminar/${id}`);
  }
}
