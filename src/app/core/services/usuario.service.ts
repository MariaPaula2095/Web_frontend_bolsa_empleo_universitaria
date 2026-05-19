import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  guardar(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.api}/guardar`, usuario);
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.api}/listar`);
  }

  buscarPorEmail(email: string): Observable<Usuario[]> {
  return this.http.get<Usuario[]>(`${this.api}/listar`);
  }

  actualizar(id: number, usuario: Partial<Usuario>): Observable<any> {
    return this.http.patch(`${this.api}/actualizar/${id}`, usuario);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.api}/eliminar/${id}`);
  }

  recuperarPassword(data: any): Observable<any> {
    return this.http.post(`${this.api}/recuperar-password`, data);
  }
}
