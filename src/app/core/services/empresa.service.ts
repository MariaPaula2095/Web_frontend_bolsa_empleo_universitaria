import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Empresa } from '../models/empresa.model';

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  private api = `${environment.apiUrl}/api/empresas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.api}/listar`);
  }

  top(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.api}/top`);
  }

  guardar(empresa: Empresa): Observable<any> {
    return this.http.post(`${this.api}/guardar`, empresa);
  }

  actualizar(id: number, empresa: Partial<Empresa>): Observable<any> {
    return this.http.put(`${this.api}/actualizar/${id}`, empresa);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/eliminar/${id}`);
  }

  buscarPorEmail(email: string): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.api}/listar`);
  }
}
