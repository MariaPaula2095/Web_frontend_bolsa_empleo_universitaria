import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SeguimientoPostulacion } from '../models/seguimiento.model';

@Injectable({ providedIn: 'root' })
export class SeguimientoService {
  private api = `${environment.apiUrl}/api/seguimientos`;

  constructor(private http: HttpClient) {}

  guardar(seguimiento: SeguimientoPostulacion): Observable<any> {
    return this.http.post(`${this.api}/guardar`, seguimiento);
  }

  listar(): Observable<SeguimientoPostulacion[]> {
    return this.http.get<SeguimientoPostulacion[]>(`${this.api}/listar`);
  }

  historial(idPostulacion: number): Observable<SeguimientoPostulacion[]> {
    return this.http.get<SeguimientoPostulacion[]>(`${this.api}/historial/${idPostulacion}`);
  }

  actualizar(id: number, seguimiento: Partial<SeguimientoPostulacion>): Observable<any> {
    return this.http.put(`${this.api}/actualizar/${id}`, seguimiento);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/eliminar/${id}`);
  }
}
