import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OfertaLaboral } from '../models/oferta-laboral.model';

@Injectable({ providedIn: 'root' })
export class OfertaLaboralService {
  private api = `${environment.apiUrl}/api/ofertas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<OfertaLaboral[]> {
    return this.http.get<OfertaLaboral[]>(`${this.api}/listar`);
  }

  activas(): Observable<OfertaLaboral[]> {
    return this.http.get<OfertaLaboral[]>(`${this.api}/activas`);
  }

  guardar(oferta: OfertaLaboral): Observable<any> {
    return this.http.post(`${this.api}/guardar`, oferta);
  }

  actualizar(id: number, oferta: Partial<OfertaLaboral>): Observable<any> {
    return this.http.put(`${this.api}/actualizar/${id}`, oferta);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/eliminar/${id}`);
  }
}
