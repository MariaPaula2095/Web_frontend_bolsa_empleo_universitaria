import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  loginUsuario(body: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/api/usuarios/login`, body).pipe(
      tap(res => this.guardarSesion(res))
    );
  }

  loginEmpresa(body: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/api/empresas/login`, body).pipe(
      tap(res => this.guardarSesion(res, 'EMPRESA'))
    );
  }

  private guardarSesion(res: any, rolForzado?: string): void {
  const token = typeof res === 'string' ? res : (res?.token ?? res?.jwt ?? '');
  if (!token) return;
  localStorage.setItem('token', token);
  const payload = this.decodificar(token);
  const rol = rolForzado ?? payload.rol ?? payload.role ?? payload.tipoUsuario ?? '';
  localStorage.setItem('rol', rol);
  localStorage.setItem('sub', payload.sub ?? '');

  // ID de usuario o empresa
  const idJwt = payload.id ?? payload.idUsuario ?? payload.userId ?? payload.sub_id;
  const idBody = res?.usuario?.idUsuario ?? res?.usuario?.id
               ?? res?.empresa?.idEmpresa ?? res?.empresa?.id
               ?? res?.id ?? res?.idUsuario;
  const id = idJwt ?? idBody;
  if (id) localStorage.setItem('id', String(id));
}

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getRol(): string | null { return localStorage.getItem('rol'); }
  getSub(): string | null { return localStorage.getItem('sub'); }
  getId(): string | null { return localStorage.getItem('id'); }
  storeId(id: number): void { localStorage.setItem('id', String(id)); }
  isLoggedIn(): boolean { return !!this.getToken(); }

  private decodificar(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return {};
    }
  }
}
