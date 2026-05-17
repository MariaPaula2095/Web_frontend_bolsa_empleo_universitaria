import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmpresaPendiente } from '../models/empresa-pendiente.model';

@Injectable({ providedIn: 'root' })
export class EmpresaPendienteService {
  private api = `${environment.apiUrl}/api/empresas-pendientes`;

  constructor(private http: HttpClient) {}

  enviar(empresa: EmpresaPendiente): Observable<any> {
    return this.http.post(`${this.api}/enviar`, empresa);
  }

  listar(): Observable<EmpresaPendiente[]> {
    return this.http.get<EmpresaPendiente[]>(`${this.api}/listar`);
  }

  aprobar(id: number, mensaje?: string): Observable<any> {
    return this.http.put(`${this.api}/aprobar/${id}`, { mensaje });
  }

  rechazar(id: number, mensaje?: string): Observable<any> {
    return this.http.put(`${this.api}/rechazar/${id}`, { mensaje });
  }

  actualizar(empresa: EmpresaPendiente): Observable<any> {
    return this.http.put(`${this.api}/actualizar`, empresa);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
