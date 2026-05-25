import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ArchivoService {
  private api = `${environment.apiUrl}/api/archivos`;

  constructor(private http: HttpClient) {}

  getFotoUsuario(id: number): Observable<Blob> {
    return this.http.get(`${this.api}/foto/usuario/${id}`, { responseType: 'blob' });
  }

  subirFotoUsuario(id: number, archivo: File): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.post(`${this.api}/foto/usuario/${id}`, form);
  }

  actualizarFotoUsuario(id: number, archivo: File): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.put(`${this.api}/foto/usuario/${id}`, form);
  }

  // --- Empresa ---

  getFotoEmpresa(id: number): Observable<Blob> {
    return this.http.get(`${this.api}/foto/empresa/${id}`, { responseType: 'blob' });
  }

  subirFotoEmpresa(id: number, archivo: File): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.post(`${this.api}/foto/empresa/${id}`, form);
  }

  actualizarFotoEmpresa(id: number, archivo: File): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.put(`${this.api}/foto/empresa/${id}`, form);
  }

  getDocumentoEmpresa(id: number): Observable<Blob> {
    return this.http.get(`${this.api}/documento/empresa/${id}`, { responseType: 'blob' });
  }

  subirDocumentoEmpresa(id: number, archivo: File): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.post(`${this.api}/documento/empresa/${id}`, form);
  }

  actualizarDocumentoEmpresa(id: number, archivo: File): Observable<any> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.put(`${this.api}/documento/empresa/${id}`, form);
  }
}
