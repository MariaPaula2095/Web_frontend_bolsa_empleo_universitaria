import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Perfil } from '../models/perfil.model';

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private api = `${environment.apiUrl}/api/perfiles`;

  constructor(private http: HttpClient) {}

  guardar(perfil: Perfil): Observable<any> {
    return this.http.post(`${this.api}/guardar`, perfil);
  }

  listar(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.api}/listar`);
  }

  porCarrera(carrera: string): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.api}/carrera/${carrera}`);
  }

  porHabilidad(habilidad: string): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.api}/habilidad/${habilidad}`);
  }

  actualizar(id: number, perfil: Partial<Perfil>): Observable<any> {
    return this.http.patch(`${this.api}/actualizar/${id}`, perfil);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/eliminar/${id}`);
  }
}
